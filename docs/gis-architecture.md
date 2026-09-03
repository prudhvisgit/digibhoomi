# BhoomiSetu GIS Architecture

## 1. GIS Engine & Map Architecture
The BhoomiSetu Web-GIS engine delivers high-performance vector parcel rendering, spatial querying, and layer toggle capabilities.

### Technologies
- **Frontend Map Engine**: MapLibre GL JS (Client vector styling, smooth zooming/panning, layer toggling) with Leaflet fallback.
- **Geospatial Data Standard**: WGS84 GeoJSON / PostGIS `ST_AsGeoJSON(geometry)`.
- **Spatial Indexing**: PostGIS `GIST` index on parcel polygon geometries for sub-millisecond bounding box and spatial intersection queries.

---

## 2. Three-Layer GIS Model Architecture

### Layer 1: Base Layer (Cadastral Boundaries & Base Maps)
- Vector parcel boundaries with ULPIN labelling.
- Georeferenced village survey map vector boundaries.
- Toggleable Basemaps: CartoDB Positron (Light), OpenStreetMap, Satellite Imagery (Esri World Imagery).

### Layer 2: Core Governance Layers
- **Record of Rights & Ownership Layer**: Color-coded by verified vs unverified ownership.
- **Land Use & Zoning Layer**: Visual distinction between Residential (Yellow), Commercial (Red), Industrial (Purple), Agricultural (Green), Special Zones.
- **Master Plan & Future Road Expansion Layer**: Highlight parcels intersecting planned road expansions or infrastructure corridors.
- **Building Permission Layer**: Approved vs Pending vs Rejected building permits.
- **Court Dispute Layer**: Red highlighting for litigated parcels.

### Layer 3: Additional / Use-Case Layers
- **Property Taxation Layer**: Green (Tax Paid) vs Orange (Pending) vs Red (Overdue).
- **Utilities Infrastructure Layer**: Electricity grids, water pipelines, sewerage networks.
- **Environmental & Flood Zone Layer**: Coastal regulation buffers, river/lake buffer zones (CRZ), 100-year flood zone overlays.
- **Valuation Reference Layer**: Sub-Registrar circle rates heatmap.

---

## 3. Spatial Queries Supported
1. `ST_Intersects`: Identify parcels affected by master plan road expansions or environmental buffers.
2. `ST_Contains`: Retrieve all parcels inside a village or mandal boundary.
3. `ST_Distance`: Compute distance from parcel centroid to nearest road or utility line.
4. `ST_Area`: Calculate true spatial polygon area in sq meters and acres to detect RoR discrepancy anomalies.
