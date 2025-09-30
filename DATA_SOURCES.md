# Data Sources and Provenance

This document describes all data sources used in the Medicaid Provider Dashboard, including their origins, processing methods, and limitations.

## 📊 Primary Data Sources

### 1. Medicaid Provider Claims Data

**Source**: Centers for Medicare & Medicaid Services (CMS)
**System**: T-MSIS (Transformed Medicaid Statistical Information System)
**Coverage**: 2016-2020
**File**: `files/theme/medicaid_src/county-table.txt`, `state-table.txt`, `national-table.txt`

**Description**:
- Provider counts by specialty, county, and year
- Medicaid beneficiary population estimates
- Provider-to-population ratios per 100,000 beneficiaries
- Percentage of providers participating in Medicaid

**Data Quality Notes**:
- Some states have data quality flags due to incomplete T-MSIS reporting
- States with data quality issues are marked but included with caveats
- Provider counts aggregated by specialty and volume categories
- Data reflects fee-for-service and managed care claims

**Limitations**:
- ⚠️ 2021 data not yet available from CMS
- Does not include providers who see only private insurance patients
- May undercount providers in managed care-dominated states
- Puerto Rico included in data but not displayed on map

### 2. Rural-Urban Continuum Codes (RUCC)

**Source**: USDA Economic Research Service
**Dataset**: 2023 Rural-Urban Continuum Codes
**URL**: https://www.ers.usda.gov/data-products/rural-urban-continuum-codes
**Downloaded**: September 30, 2025
**File**: `Data Preprocessing/county_rucc_2023.json`

**Description**:
- Official USDA classification of all US counties into 9 categories
- Based on 2020 Census and Office of Management and Budget metro area delineations
- Distinguishes metro counties by population size
- Distinguishes nonmetro counties by urbanization and adjacency to metro areas

**Classification Scheme**:
```
Metro Counties (1,252 total):
  1. Metro areas of 1 million+ population        (483 counties)
  2. Metro areas of 250,000-1 million population (398 counties)
  3. Metro areas of <250,000 population          (371 counties)

Nonmetro Counties (1,981 total):
  4. Urban 20K+, adjacent to metro               (204 counties)
  5. Urban 20K+, not adjacent to metro           (81 counties)
  6. Urban 2,500-19,999, adjacent to metro       (385 counties)
  7. Urban 2,500-19,999, not adjacent to metro   (248 counties)
  8. Urban <5,000, adjacent to metro             (468 counties)
  9. Urban <5,000, not adjacent to metro         (595 counties)
```

**Important Changes in 2023**:
- Urban area population threshold changed from 2,500 to 5,000
- Some Virginia independent cities combined with surrounding counties
- Codes updated after each decennial census

**Data Quality**:
- ✅ Official USDA data - scientifically valid
- ✅ Covers all 3,233 US counties and county-equivalents
- ✅ Validated against known major metro areas

### 3. Geographic Boundaries

**Source**: U.S. Census Bureau
**Dataset**: TIGER/Line Shapefiles
**Year**: 2018
**Format**: TopoJSON (simplified from original shapefile)
**File**: `files/theme/medicaid_src/tl_2018_us_simplified.json`

**Description**:
- County and state boundaries for mapping
- Simplified geometry for web performance
- Does not include Puerto Rico, U.S. territories

**Coverage**:
- 3,142 county/county-equivalent boundaries
- 50 states + District of Columbia
- Albers USA projection optimized for continental US

**Limitations**:
- Boundaries from 2018 may not reflect recent county changes
- Simplified geometry may lack precision for detailed analysis
- Puerto Rico and territories not included

### 4. Data Quality Indicators

**Source**: Custom analysis of T-MSIS data
**File**: `files/theme/medicaid_src/state_dq.csv`

**Description**:
- Flags for states with known T-MSIS reporting issues
- Separate flags for outpatient (OT) and prescription (RX) claims
- Used to display warnings and exclude from rankings when appropriate

---

## 🔄 Data Processing

### Provider Data Processing

1. **Aggregation**: Raw claims data aggregated to county level
2. **Specialty Mapping**: Claims mapped to 6 provider specialty categories
3. **Volume Filtering**: Providers grouped by Medicaid beneficiary volume
4. **Ratio Calculation**: Providers per 100,000 Medicaid beneficiaries
5. **Ranking**: Quintile-based rankings at national and state levels

### RUCC Data Processing

1. **Download**: Official Excel file from USDA ERS
2. **Parsing**: Extracted FIPS codes and RUCC classifications
3. **Categorization**: Mapped 9 RUCC codes to 4 simplified categories:
   - Metro (1-3)
   - Nonmetro Adjacent (4, 6, 8)
   - Nonmetro Remote (5, 7)
   - Frontier (9)
4. **Validation**: Verified against known major metro counties
5. **JSON Conversion**: Structured for web dashboard integration

---

## ⚠️ Known Limitations and Caveats

### Data Currency

- **Provider data latest year**: 2020
- **RUCC classifications**: 2023 (based on 2020 Census)
- **Geographic boundaries**: 2018

**Impact**: 2021 COVID-19 pandemic effects not reflected in provider data.

### Geographic Coverage

- **Mainland US**: Complete coverage ✅
- **Puerto Rico**: Data available but not displayed on map ⚠️
- **Territories**: Not included ❌

**Impact**: 78 Puerto Rico municipalities have provider data but won't appear on map.

### Data Quality Variations

States with T-MSIS data quality flags should be interpreted cautiously:
- May undercount providers
- Rankings may not be directly comparable
- Clearly marked on dashboard with gray coloring

### Provider Counting Methodology

- **Counted once per specialty per volume category**
- **May practice across multiple counties** (counted in each)
- **Volume categories may overlap** in raw data
- **Managed care data completeness varies** by state

---

## 📈 Data Validation

### Validation Tests Performed

1. ✅ RUCC data matches official USDA distribution
2. ✅ Major metros correctly classified (NYC, LA, Chicago, etc.)
3. ✅ FIPS codes consistent across all datasets
4. ✅ Provider ratios mathematically validated
5. ✅ Geographic boundaries align with FIPS codes

### Known Validation Issues

- 78 Puerto Rico counties in data not in map ✓ Documented
- San Diego County correctly shows as RUCC 1 ✓ Fixed with official data
- RUCC 9 (frontier) counties: 595 in official data ✓ Corrected

---

## 🔗 External Resources

### Official Data Sources

- **CMS T-MSIS**: https://www.medicaid.gov/dq-atlas/welcome
- **USDA RUCC Codes**: https://www.ers.usda.gov/data-products/rural-urban-continuum-codes
- **Census TIGER/Line**: https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html

### Data Documentation

- **T-MSIS Data Quality**: https://www.medicaid.gov/dq-atlas
- **RUCC Documentation**: https://www.ers.usda.gov/data-products/rural-urban-continuum-codes/documentation
- **Provider Taxonomy**: https://taxonomy.nucc.org/

---

## 📝 Citation Guidelines

### How to Cite This Dashboard

```
Medicaid Provider Access Dashboard (2024). Provider data from Centers for
Medicare & Medicaid Services T-MSIS (2016-2020). Rural-Urban classifications
from USDA Economic Research Service 2023 Rural-Urban Continuum Codes.
```

### How to Cite Underlying Data

**Provider Data**:
```
Centers for Medicare & Medicaid Services. Transformed Medicaid Statistical
Information System (T-MSIS) Analytic Files, 2016-2020.
```

**RUCC Data**:
```
United States Department of Agriculture, Economic Research Service. 2023
Rural-Urban Continuum Codes. https://www.ers.usda.gov/data-products/
rural-urban-continuum-codes
```

---

## 🔄 Update History

### September 30, 2025
- **CRITICAL FIX**: Replaced algorithmically-generated RUCC data with official USDA 2023 data
- **Removed**: False 2021 data claims
- **Added**: Complete data provenance documentation
- **Validated**: All major metro area classifications

### Previous Updates
- Initial dashboard development with 2016-2020 provider data
- Integration of RUCC classification framework
- Implementation of rural/urban visualization features

---

## 💡 Best Practices for Data Users

### Interpretation Guidelines

1. **Check data quality flags** before comparing states
2. **Consider time lag** - data reflects 2016-2020 provider landscape
3. **Account for methodology** - managed care vs fee-for-service
4. **Use RUCC codes appropriately** - 9 categories vs 4 simplified
5. **Understand limitations** - provider counts, not patient access

### Recommended Use Cases

✅ **Appropriate Uses**:
- Comparing provider supply across counties/states
- Analyzing rural-urban disparities in provider access
- Tracking trends over 2016-2020 period
- Identifying potential provider shortage areas

❌ **Inappropriate Uses**:
- Measuring actual patient access to care
- Determining individual provider quality
- Making 2021+ predictions without caveats
- Direct comparison of states with data quality flags

---

## 📧 Questions or Issues

For questions about data sources or methodology:
- Review this documentation first
- Check `IMPLEMENTATION_NOTES.md` for technical details
- Open an issue on GitHub for specific data questions

For official data inquiries:
- **CMS T-MSIS**: Contact CMS via medicaid.gov
- **USDA RUCC**: Contact ERS via ers.usda.gov

---

**Last Updated**: September 30, 2025
**Dashboard Version**: v1.8
**Data Validation Status**: ✅ Complete and Verified