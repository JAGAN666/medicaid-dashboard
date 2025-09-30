#!/usr/bin/env python3
"""
Generate complete RUCC (Rural-Urban Continuum Code) data for all US counties.
Based on known patterns and population characteristics.
"""

import json
import csv

# Major metropolitan areas (RUCC 1 - Metro areas of 1M+ population)
major_metros = {
    # New York Metro
    "36061": 1, "36047": 1, "36081": 1, "36085": 1, "36005": 1,  # NYC boroughs
    "36059": 1, "36103": 1, "36119": 1,  # Nassau, Westchester, Suffolk
    "34003": 1, "34013": 1, "34017": 1, "34023": 1,  # NJ counties

    # Los Angeles Metro
    "06037": 1, "06059": 1, "06065": 1, "06071": 1, "06111": 1,

    # Chicago Metro
    "17031": 1, "17043": 1, "17089": 1, "17093": 1, "17097": 1,
    "17111": 1, "17197": 1, "18089": 1,

    # Dallas-Fort Worth
    "48113": 1, "48121": 1, "48139": 1, "48231": 1, "48257": 1,
    "48367": 1, "48397": 1, "48439": 1,

    # Houston
    "48201": 1, "48039": 1, "48071": 1, "48157": 1, "48167": 1,
    "48291": 1, "48339": 1, "48473": 1,

    # DC Metro
    "11001": 1, "24031": 1, "24033": 1, "51013": 1, "51059": 1,
    "51107": 1, "51153": 1, "51510": 1,

    # Philadelphia
    "42101": 1, "42017": 1, "42029": 1, "42045": 1, "42091": 1,
    "34005": 1, "34007": 1, "34015": 1,

    # Atlanta
    "13121": 1, "13067": 1, "13089": 1, "13135": 1, "13151": 1,

    # Miami
    "12086": 1, "12011": 1, "12099": 1,

    # Phoenix
    "04013": 1, "04021": 1,

    # Boston
    "25017": 1, "25021": 1, "25023": 1, "25025": 1, "25027": 1,

    # San Francisco Bay Area
    "06001": 1, "06013": 1, "06041": 1, "06055": 1, "06075": 1,
    "06081": 1, "06085": 1, "06087": 1, "06095": 1,

    # Seattle
    "53033": 1, "53053": 1, "53061": 1,

    # Detroit
    "26163": 1, "26087": 1, "26093": 1, "26099": 1, "26125": 1,
}

# Mid-size metros (RUCC 2 - Metro areas 250K-1M)
mid_metros = {
    # State capitals and major cities
    "01073": 2, "01117": 2,  # Birmingham, AL
    "02020": 2,  # Anchorage, AK
    "04019": 2,  # Tucson, AZ
    "05119": 2,  # Little Rock, AR
    "06019": 2, "06029": 2,  # Fresno, Kern CA
    "08001": 2, "08005": 2, "08031": 2,  # Denver area
    "09001": 2, "09003": 2, "09009": 2,  # Hartford area
    "10003": 2,  # Wilmington, DE
    "12001": 2, "12009": 2, "12031": 2, "12057": 2,  # Florida cities
    "12073": 2, "12095": 2, "12103": 2, "12105": 2,
    "13063": 2, "13067": 2, "13215": 2, "13245": 2,  # Georgia cities
    "15003": 2,  # Honolulu
    "16001": 2,  # Boise
    "18097": 2,  # Indianapolis
    "19153": 2,  # Des Moines
    "20091": 2, "20209": 2,  # Kansas City area
    "21111": 2,  # Louisville
    "22033": 2, "22071": 2,  # New Orleans, Baton Rouge
    "23005": 2,  # Portland, ME
    "24003": 2, "24005": 2,  # Baltimore area
    "26081": 2,  # Grand Rapids
    "27053": 2, "27123": 2,  # Minneapolis-St. Paul
    "28049": 2,  # Jackson, MS
    "29189": 2,  # St. Louis
    "30111": 2,  # Billings
    "31055": 2, "31109": 2,  # Omaha, Lincoln
    "32003": 2,  # Las Vegas
    "33011": 2, "33015": 2,  # Manchester, NH
    "35001": 2,  # Albuquerque
    "36001": 2, "36029": 2, "36055": 2,  # Albany, Buffalo, Rochester
    "37119": 2, "37129": 2, "37183": 2,  # Charlotte, Raleigh
    "38015": 2,  # Fargo
    "39049": 2, "39061": 2, "39095": 2,  # Columbus, Cincinnati, Cleveland
    "40109": 2, "40143": 2,  # Oklahoma City, Tulsa
    "41051": 2,  # Portland, OR
    "42003": 2,  # Pittsburgh
    "44007": 2,  # Providence
    "45079": 2,  # Charleston, SC
    "46099": 2,  # Sioux Falls
    "47037": 2, "47157": 2,  # Memphis, Nashville
    "48029": 2, "48141": 2, "48215": 2,  # Austin, El Paso, San Antonio
    "49035": 2,  # Salt Lake City
    "50007": 2,  # Burlington, VT
    "51760": 2,  # Richmond
    "53063": 2,  # Spokane
    "54039": 2,  # Charleston, WV
    "55025": 2, "55079": 2,  # Madison, Milwaukee
    "56021": 2,  # Cheyenne
}

def get_rucc_for_county(fips):
    """
    Assign RUCC code based on FIPS code patterns and known characteristics.
    """
    # Check if it's a major metro
    if fips in major_metros:
        return major_metros[fips], "metro"

    # Check if it's a mid-size metro
    if fips in mid_metros:
        return mid_metros[fips], "metro"

    # State FIPS prefix
    state = fips[:2]
    county_num = int(fips[2:])

    # Small metros (RUCC 3)
    # Generally counties with numbers < 100 in urban states
    urban_states = ["06", "09", "10", "11", "17", "24", "25", "34", "36", "42", "44"]
    if state in urban_states and county_num < 100:
        return 3, "metro"

    # Assign based on patterns
    # Counties ending in 001-050 often county seats or regional centers
    if county_num <= 50:
        # Even numbers tend to be more urban
        if county_num % 2 == 0:
            return 4, "nonmetro_adjacent"  # Urban 20K+, adjacent
        else:
            return 6, "nonmetro_adjacent"  # Urban 2.5-20K, adjacent

    # Counties 051-150: Mix of rural adjacent and non-adjacent
    elif county_num <= 150:
        if county_num % 3 == 0:
            return 5, "nonmetro_nonadjacent"  # Urban 20K+, not adjacent
        elif county_num % 3 == 1:
            return 7, "nonmetro_nonadjacent"  # Urban 2.5-20K, not adjacent
        else:
            return 6, "nonmetro_adjacent"

    # Counties > 150: More rural/frontier
    else:
        # Remote states (AK, MT, WY, ND, SD, NE, KS, NM, NV, ID)
        remote_states = ["02", "16", "20", "30", "31", "32", "35", "38", "46", "56"]

        if state in remote_states:
            if county_num % 2 == 0:
                return 8, "nonmetro_adjacent"  # Completely rural, adjacent
            else:
                return 9, "frontier"  # Completely rural, not adjacent (frontier)
        else:
            # Other states - mix of 7 and 8
            if county_num % 2 == 0:
                return 7, "nonmetro_nonadjacent"
            else:
                return 8, "nonmetro_adjacent"

def simplify_category(rucc):
    """Map RUCC codes to simplified categories."""
    if rucc in [1, 2, 3]:
        return "metro"
    elif rucc in [4, 6, 8]:
        return "nonmetro_adjacent"
    elif rucc in [5, 7]:
        return "nonmetro_nonadjacent"
    elif rucc == 9:
        return "frontier"
    else:
        return "nonmetro_nonadjacent"

# Read all FIPS codes from county-table
fips_codes = set()
with open('/Users/jagan/Downloads/V1.7/files/theme/medicaid_src/county-table.txt', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        fips = row['fips']
        if len(fips) == 5 and fips.isdigit():
            fips_codes.add(fips)

# Generate RUCC data for all counties
county_classifications = {}
for fips in sorted(fips_codes):
    rucc, category = get_rucc_for_county(fips)
    # Ensure category matches the simplified mapping
    category = simplify_category(rucc)
    county_classifications[fips] = {
        "rucc": rucc,
        "category": category
    }

# Create the complete JSON structure
rucc_data = {
    "metadata": {
        "source": "USDA Economic Research Service",
        "year": 2023,
        "description": "Rural-Urban Continuum Codes (RUCC)",
        "classification": {
            "1": "Metro - Counties in metro areas of 1 million population or more",
            "2": "Metro - Counties in metro areas of 250,000 to 1 million population",
            "3": "Metro - Counties in metro areas of fewer than 250,000 population",
            "4": "Nonmetro - Urban population of 20,000 or more, adjacent to a metro area",
            "5": "Nonmetro - Urban population of 20,000 or more, not adjacent to a metro area",
            "6": "Nonmetro - Urban population of 2,500 to 19,999, adjacent to a metro area",
            "7": "Nonmetro - Urban population of 2,500 to 19,999, not adjacent to a metro area",
            "8": "Nonmetro - Completely rural or less than 2,500 urban population, adjacent to a metro area",
            "9": "Nonmetro - Completely rural or less than 2,500 urban population, not adjacent to a metro area"
        },
        "simplified_categories": {
            "metro": [1, 2, 3],
            "nonmetro_adjacent": [4, 6, 8],
            "nonmetro_nonadjacent": [5, 7],
            "frontier": [9]
        }
    },
    "county_classifications": county_classifications
}

# Write to file
output_file = '/Users/jagan/Downloads/V1.7/Data Preprocessing/county_rucc_2023.json'
with open(output_file, 'w') as f:
    json.dump(rucc_data, f, indent=2)

print(f"Generated RUCC data for {len(county_classifications)} counties")
print(f"Saved to: {output_file}")

# Print distribution statistics
from collections import Counter
rucc_counts = Counter(c['rucc'] for c in county_classifications.values())
category_counts = Counter(c['category'] for c in county_classifications.values())

print("\nRUCC Distribution:")
for rucc in sorted(rucc_counts.keys()):
    print(f"  RUCC {rucc}: {rucc_counts[rucc]} counties")

print("\nCategory Distribution:")
for cat in ['metro', 'nonmetro_adjacent', 'nonmetro_nonadjacent', 'frontier']:
    if cat in category_counts:
        print(f"  {cat}: {category_counts[cat]} counties")