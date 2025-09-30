# Medicaid Provider Access Dashboard

An interactive visualization tool for analyzing Medicaid healthcare provider accessibility across the United States at state and county levels.

## 🌟 Features

- **Geographic Visualization**: Interactive choropleth maps with state and county-level data
- **Time Series Analysis**: Track provider trends from 2016-2021
- **Rural/Urban Analysis**: Filter and compare provider access by geographic classification
- **Provider Specialties**: Analyze 6 different provider types:
  - Family Medicine
  - Internal Medicine
  - Pediatrics
  - OB/GYN
  - Advanced Practice Registered Nurses (APRN)
  - Physician Assistants
- **Statistical Trends**: Linear regression analysis with R² values
- **Flexible Metrics**:
  - Provider-to-population ratios (per 100K Medicaid beneficiaries)
  - Percentage of providers participating in Medicaid

## 🚀 Live Demo

Visit the dashboard: [https://yourusername.github.io/medicaid-dashboard/](https://yourusername.github.io/medicaid-dashboard/)

## 📊 Data Sources

- **Provider Data**: CMS Medicaid claims data (2016-2020)
- **Population Data**: U.S. Census Bureau estimates
- **Geographic Boundaries**: U.S. Census TIGER/Line Shapefiles (TopoJSON)
- **Rural/Urban Classification**: USDA Economic Research Service RUCC codes

## 🛠️ Technology Stack

- **D3.js v7**: Data visualization and mapping
- **TopoJSON**: Efficient geographic data representation
- **jQuery**: UI interactions
- **Pure JavaScript**: No backend required - runs entirely in browser

## 📁 Project Structure

```
V1.7/
├── index.html                          # Main dashboard page
├── files/
│   └── theme/
│       ├── medicaid_js/
│       │   ├── medicaid_map_v1.7.js   # Core visualization logic
│       │   ├── trend_analyzer.js       # Statistical analysis
│       │   ├── rural_urban_utils.js    # Rural/urban calculations
│       │   └── [other utilities]
│       └── medicaid_src/
│           ├── county-table.txt        # County-level provider data
│           ├── state-table.txt         # State-level provider data
│           ├── national-table.txt      # National aggregates
│           ├── tl_2018_us_simplified.json  # Geographic boundaries
│           └── county_rucc_2023.json   # Rural/urban classifications
├── Data Preprocessing/
│   └── county_rucc_2023.json          # RUCC classification data
└── [Documentation files]
```

## 🖥️ Local Development

### Option 1: Python Server
```bash
cd V1.7
python3 -m http.server 8000
```
Visit: http://localhost:8000

### Option 2: Node.js Server
```bash
cd V1.7
npx http-server -p 8000
```
Visit: http://localhost:8000

### Option 3: VS Code Live Server
- Install "Live Server" extension
- Right-click `index.html`
- Select "Open with Live Server"

## 📖 User Guide

### Basic Navigation
1. **Select Year**: Use dropdown to choose 2016-2021
2. **Choose Specialties**: Check/uncheck provider types
3. **Filter Volume**: Select minimum beneficiary volumes
4. **Rural/Urban Filter**: Toggle geographic categories
5. **Click States**: Zoom into county-level detail
6. **View Trends**: Toggle trend switch for regression analysis

### Metrics
- **Provider to Population Ratio**: Providers per 100,000 Medicaid beneficiaries
- **% Participating**: Percentage of total providers accepting Medicaid

### Map Colors
- **Darker Blue**: Better provider access (higher ratios)
- **Lighter Blue**: Lower provider access
- **White**: No data
- **Gray**: Data quality issues

## 🔧 Configuration

### Adding 2021 Data
1. Update CSV files in `Data Preprocessing/`
2. Run Stata preprocessing scripts
3. Copy output files to `files/theme/medicaid_src/`
4. Refresh dashboard

### Updating RUCC Classifications
1. Download latest RUCC data from USDA ERS
2. Convert to JSON format
3. Update `Data Preprocessing/county_rucc_2023.json`

## 📊 Data Specifications

### File Sizes
- Total web files: ~10MB
- Largest file: county-table.txt (7.7MB)
- Geographic data: tl_2018_us_simplified.json (1.9MB)

### Browser Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Internet Explorer is not supported.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Test thoroughly across browsers
4. Submit a pull request

## 📄 License

[Specify your license here - e.g., MIT, Apache 2.0, etc.]

## 👥 Authors

[Your name/organization]

## 🙏 Acknowledgments

- Centers for Medicare & Medicaid Services (CMS) for provider data
- U.S. Census Bureau for population estimates
- USDA Economic Research Service for rural/urban classifications

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Review documentation in `IMPLEMENTATION_NOTES.md`
- Check `QUICK_START_GUIDE.md` for common questions

## 🔄 Version History

### v1.8 (2024)
- Added 2021 year support
- Implemented rural/urban filtering (RUCC codes)
- Enhanced trend visualization with linear regression
- Added statistical analysis tools
- Created disparity calculation framework

### v1.7 (2024)
- Original release
- 2016-2020 data coverage
- Basic state and county visualization
- Provider specialty filtering

## 📈 Future Enhancements

- [ ] PDF report generation
- [ ] Multi-state comparison mode
- [ ] Confidence interval visualization
- [ ] Policy impact markers (Medicaid expansion dates)
- [ ] Mobile-optimized interface
- [ ] CSV data export functionality

---

**Built with ❤️ for healthcare policy analysis**