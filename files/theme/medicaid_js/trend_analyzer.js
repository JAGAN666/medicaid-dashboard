/**
 * Trend Analyzer for Medicaid Provider Dashboard
 * Provides statistical analysis and visualization enhancements for longitudinal data
 */

class TrendAnalyzer {
  constructor() {
    this.years = [2016, 2017, 2018, 2019, 2020, 2021];
  }

  /**
   * Calculate linear regression for trend line
   * @param {Array} data - Array of {x: year, y: value} objects
   * @returns {Object} - {slope, intercept, rSquared, predictions}
   */
  linearRegression(data) {
    if (!data || data.length < 2) return null;

    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    data.forEach(point => {
      sumX += point.x;
      sumY += point.y;
      sumXY += point.x * point.y;
      sumX2 += point.x * point.x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R²
    const yMean = sumY / n;
    let ssTotal = 0, ssResidual = 0;

    data.forEach(point => {
      const yPred = slope * point.x + intercept;
      ssTotal += Math.pow(point.y - yMean, 2);
      ssResidual += Math.pow(point.y - yPred, 2);
    });

    const rSquared = 1 - (ssResidual / ssTotal);

    // Generate predictions
    const predictions = data.map(point => ({
      x: point.x,
      y: slope * point.x + intercept
    }));

    return {
      slope,
      intercept,
      rSquared,
      predictions,
      equation: `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`
    };
  }

  /**
   * Calculate moving average
   * @param {Array} data - Time series data
   * @param {Number} window - Moving average window size
   * @returns {Array} - Smoothed data
   */
  movingAverage(data, window = 3) {
    if (!data || data.length < window) return data;

    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < window - 1) {
        result.push(data[i]);
      } else {
        let sum = 0;
        for (let j = 0; j < window; j++) {
          sum += data[i - j].y;
        }
        result.push({
          x: data[i].x,
          y: sum / window
        });
      }
    }
    return result;
  }

  /**
   * Calculate year-over-year growth rate
   * @param {Array} data - Time series data
   * @returns {Array} - Growth rates
   */
  calculateGrowthRates(data) {
    if (!data || data.length < 2) return [];

    const growthRates = [];
    for (let i = 1; i < data.length; i++) {
      const growth = ((data[i].y - data[i - 1].y) / data[i - 1].y) * 100;
      growthRates.push({
        x: data[i].x,
        y: growth,
        label: `${growth.toFixed(1)}%`
      });
    }
    return growthRates;
  }

  /**
   * Detect significant change points in the data
   * @param {Array} data - Time series data
   * @param {Number} threshold - Percentage threshold for significant change
   * @returns {Array} - Change points
   */
  detectChangePoints(data, threshold = 10) {
    if (!data || data.length < 2) return [];

    const changePoints = [];
    for (let i = 1; i < data.length; i++) {
      const change = Math.abs(((data[i].y - data[i - 1].y) / data[i - 1].y) * 100);
      if (change > threshold) {
        changePoints.push({
          year: data[i].x,
          change: ((data[i].y - data[i - 1].y) / data[i - 1].y) * 100,
          previousValue: data[i - 1].y,
          currentValue: data[i].y
        });
      }
    }
    return changePoints;
  }

  /**
   * Calculate confidence intervals for predictions
   * @param {Array} data - Historical data
   * @param {Number} confidenceLevel - Confidence level (e.g., 0.95 for 95%)
   * @returns {Object} - Upper and lower bounds
   */
  calculateConfidenceInterval(data, confidenceLevel = 0.95) {
    if (!data || data.length < 3) return null;

    const regression = this.linearRegression(data);
    if (!regression) return null;

    // Calculate standard error
    let sumSquaredResiduals = 0;
    data.forEach(point => {
      const predicted = regression.slope * point.x + regression.intercept;
      sumSquaredResiduals += Math.pow(point.y - predicted, 2);
    });

    const standardError = Math.sqrt(sumSquaredResiduals / (data.length - 2));

    // t-value for given confidence level (approximation for common values)
    const tValue = confidenceLevel === 0.95 ? 1.96 : 2.58; // 95% or 99%

    const upperBound = regression.predictions.map(p => ({
      x: p.x,
      y: p.y + tValue * standardError
    }));

    const lowerBound = regression.predictions.map(p => ({
      x: p.x,
      y: p.y - tValue * standardError
    }));

    return {
      upperBound,
      lowerBound,
      standardError
    };
  }

  /**
   * Compare trends between multiple regions
   * @param {Object} regionsData - Object with region names as keys and data arrays as values
   * @returns {Object} - Comparative statistics
   */
  compareTrends(regionsData) {
    const results = {};

    for (const [region, data] of Object.entries(regionsData)) {
      const regression = this.linearRegression(data);
      const growthRates = this.calculateGrowthRates(data);
      const avgGrowth = growthRates.reduce((sum, r) => sum + r.y, 0) / growthRates.length;

      results[region] = {
        regression,
        avgGrowthRate: avgGrowth,
        totalChange: ((data[data.length - 1].y - data[0].y) / data[0].y) * 100,
        isImproving: regression ? regression.slope > 0 : false
      };
    }

    return results;
  }

  /**
   * Format trend data for D3 visualization
   * @param {Array} data - Raw data
   * @param {Object} options - Formatting options
   * @returns {Object} - Formatted data ready for D3
   */
  formatForVisualization(data, options = {}) {
    const {
      includeTrendLine = true,
      includeConfidenceInterval = false,
      includeMovingAverage = false,
      movingAverageWindow = 3
    } = options;

    const result = {
      original: data
    };

    if (includeTrendLine) {
      const regression = this.linearRegression(data);
      if (regression) {
        result.trendLine = regression.predictions;
        result.rSquared = regression.rSquared;
        result.equation = regression.equation;
      }
    }

    if (includeConfidenceInterval) {
      const ci = this.calculateConfidenceInterval(data);
      if (ci) {
        result.confidenceInterval = ci;
      }
    }

    if (includeMovingAverage) {
      result.movingAverage = this.movingAverage(data, movingAverageWindow);
    }

    return result;
  }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TrendAnalyzer;
}