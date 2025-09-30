/**
 * Rural/Urban Disparity Analysis Utilities
 * Functions to calculate and display healthcare access disparities
 */

class RuralUrbanAnalyzer {
  constructor(rucc_data) {
    this.rucc_data = rucc_data;
  }

  /**
   * Calculate provider-to-population ratio by rural/urban category
   * @param {Object} county_data - County-level data
   * @param {Number} year - Year to analyze
   * @param {Array} specialties - Specialties to include
   * @param {Array} volumes - Volume categories to include
   * @returns {Object} - Ratios by category
   */
  calculateRatiosByCategory(county_data, year, specialties, volumes) {
    const categories = {
      metro: { providers: 0, population: 0, counties: 0 },
      nonmetro_adjacent: { providers: 0, population: 0, counties: 0 },
      nonmetro_nonadjacent: { providers: 0, population: 0, counties: 0 },
      frontier: { providers: 0, population: 0, counties: 0 }
    };

    // Aggregate data by category
    for (const [fips, countyInfo] of Object.entries(county_data)) {
      if (!this.rucc_data.county_classifications ||
          !this.rucc_data.county_classifications[fips]) {
        continue;
      }

      const category = this.rucc_data.county_classifications[fips].category;
      const rucc = this.rucc_data.county_classifications[fips].rucc;

      if (countyInfo[year] && countyInfo[year].Data) {
        let countyProviders = 0;

        countyInfo[year].Data.forEach(record => {
          if (specialties.includes(record.specialty) &&
              volumes.includes(record.volume)) {
            countyProviders += parseInt(record.providers) || 0;
          }
        });

        categories[category].providers += countyProviders;
        categories[category].population += parseInt(countyInfo[year].pop) || 0;
        categories[category].counties += 1;

        // Also count as frontier if RUCC is 8 or 9
        if (rucc >= 8) {
          categories.frontier.providers += countyProviders;
          categories.frontier.population += parseInt(countyInfo[year].pop) || 0;
          categories.frontier.counties += 1;
        }
      }
    }

    // Calculate ratios (per 100,000 population)
    const ratios = {};
    for (const [category, data] of Object.entries(categories)) {
      ratios[category] = {
        ratio: data.population > 0 ? (data.providers / data.population * 100000) : 0,
        providers: data.providers,
        population: data.population,
        counties: data.counties
      };
    }

    return ratios;
  }

  /**
   * Calculate disparity metrics between rural and urban areas
   * @param {Object} ratios - Ratios by category from calculateRatiosByCategory
   * @returns {Object} - Disparity metrics
   */
  calculateDisparityMetrics(ratios) {
    const urbanRatio = ratios.metro.ratio;
    const ruralRatio = (ratios.nonmetro_adjacent.ratio + ratios.nonmetro_nonadjacent.ratio) / 2;

    const absoluteDisparity = urbanRatio - ruralRatio;
    const relativeDisparity = urbanRatio > 0 ? ((urbanRatio - ruralRatio) / urbanRatio * 100) : 0;

    const disparityRatio = ruralRatio > 0 ? (urbanRatio / ruralRatio) : 0;

    return {
      urbanRatio: urbanRatio.toFixed(2),
      ruralRatio: ruralRatio.toFixed(2),
      absoluteDisparity: absoluteDisparity.toFixed(2),
      relativeDisparity: relativeDisparity.toFixed(1),
      disparityRatio: disparityRatio.toFixed(2),
      interpretation: this.interpretDisparity(relativeDisparity)
    };
  }

  /**
   * Interpret disparity level
   * @param {Number} relativeDisparity - Relative disparity percentage
   * @returns {String} - Interpretation
   */
  interpretDisparity(relativeDisparity) {
    const absDisparity = Math.abs(relativeDisparity);
    if (absDisparity < 10) return "Minimal disparity";
    if (absDisparity < 25) return "Moderate disparity";
    if (absDisparity < 50) return "Significant disparity";
    return "Severe disparity";
  }

  /**
   * Identify underserved counties
   * @param {Object} county_data - County-level data
   * @param {Number} year - Year to analyze
   * @param {Number} threshold - Ratio threshold below which is considered underserved
   * @returns {Array} - List of underserved counties
   */
  identifyUnderservedCounties(county_data, year, threshold = 50) {
    const underserved = [];

    for (const [fips, countyInfo] of Object.entries(county_data)) {
      if (!countyInfo[year] || !countyInfo[year].Data) continue;

      let providers = 0;
      let population = countyInfo[year].pop;

      countyInfo[year].Data.forEach(record => {
        providers += parseInt(record.providers) || 0;
      });

      const ratio = population > 0 ? (providers / population * 100000) : 0;

      if (ratio < threshold && population > 0) {
        const rucc = this.rucc_data.county_classifications[fips];
        underserved.push({
          fips,
          ratio: ratio.toFixed(2),
          population,
          providers,
          category: rucc ? rucc.category : 'unknown',
          rucc_code: rucc ? rucc.rucc : null
        });
      }
    }

    // Sort by ratio (lowest first)
    underserved.sort((a, b) => parseFloat(a.ratio) - parseFloat(b.ratio));

    return underserved;
  }

  /**
   * Generate rural access report card HTML
   * @param {Object} ratios - Ratios by category
   * @param {Object} disparityMetrics - Disparity metrics
   * @returns {String} - HTML string
   */
  generateReportHTML(ratios, disparityMetrics) {
    return `
      <div style="padding: 10px; font-size: 12px;">
        <h3 style="margin: 5px 0; color: #034B77;">Rural/Urban Access Analysis</h3>

        <div style="margin: 10px 0;">
          <strong>Provider Ratios (per 100K pop):</strong><br/>
          <div style="padding-left: 10px;">
            Metro: <span style="font-weight: bold; color: #2196F3;">${ratios.metro.ratio.toFixed(1)}</span><br/>
            Rural Adjacent: <span style="font-weight: bold; color: #FF9800;">${ratios.nonmetro_adjacent.ratio.toFixed(1)}</span><br/>
            Rural Remote: <span style="font-weight: bold; color: #F44336;">${ratios.nonmetro_nonadjacent.ratio.toFixed(1)}</span><br/>
            Frontier: <span style="font-weight: bold; color: #9C27B0;">${ratios.frontier.ratio.toFixed(1)}</span>
          </div>
        </div>

        <div style="margin: 10px 0;">
          <strong>Disparity Analysis:</strong><br/>
          <div style="padding-left: 10px;">
            Urban-Rural Gap: <strong>${disparityMetrics.absoluteDisparity}</strong><br/>
            Relative Disparity: <strong>${disparityMetrics.relativeDisparity}%</strong><br/>
            Status: <span style="color: ${this.getDisparityColor(disparityMetrics.relativeDisparity)};">
              <strong>${disparityMetrics.interpretation}</strong>
            </span>
          </div>
        </div>

        <div style="margin: 10px 0; font-size: 10px; color: #666;">
          <em>Note: Higher ratios indicate better provider availability.</em>
        </div>
      </div>
    `;
  }

  /**
   * Get color for disparity level
   * @param {Number} relativeDisparity - Relative disparity percentage
   * @returns {String} - Color code
   */
  getDisparityColor(relativeDisparity) {
    const absDisparity = Math.abs(relativeDisparity);
    if (absDisparity < 10) return "#4CAF50"; // Green
    if (absDisparity < 25) return "#FF9800"; // Orange
    if (absDisparity < 50) return "#F44336"; // Red
    return "#9C27B0"; // Purple
  }

  /**
   * Calculate trend in rural/urban disparity over time
   * @param {Object} county_data - County-level data
   * @param {Array} years - Years to analyze
   * @returns {Array} - Disparity trends
   */
  calculateDisparityTrend(county_data, years) {
    const trends = [];

    years.forEach(year => {
      const ratios = this.calculateRatiosByCategory(county_data, year, [], []);
      const metrics = this.calculateDisparityMetrics(ratios);

      trends.push({
        year,
        urbanRatio: parseFloat(metrics.urbanRatio),
        ruralRatio: parseFloat(metrics.ruralRatio),
        disparity: parseFloat(metrics.relativeDisparity)
      });
    });

    return trends;
  }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RuralUrbanAnalyzer;
}