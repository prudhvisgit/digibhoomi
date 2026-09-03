import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LayerState } from './LayerControl';
import { ParcelFeature } from '../../types';

interface GisExplorerProps {
  geoJsonData: { type: string; features: ParcelFeature[] } | null;
  selectedUlpin: string | null;
  onSelectParcel: (ulpin: string) => void;
  activeLayers: LayerState;
  baseMap: 'street' | 'satellite' | 'dark';
}

export const GisExplorer: React.FC<GisExplorerProps> = ({
  geoJsonData,
  selectedUlpin,
  onSelectParcel,
  activeLayers,
  baseMap
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const geoJsonLayer = useRef<L.GeoJSON | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map Instance centered on Visakhapatnam
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, {
      center: [17.6868, 83.2185],
      zoom: 14,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    leafletMap.current = map;

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  // Update Basemap Layer (Street View Default)
  useEffect(() => {
    if (!leafletMap.current) return;

    if (tileLayerRef.current) {
      leafletMap.current.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    if (baseMap === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri World Imagery';
    } else if (baseMap === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO Dark';
    } else {
      // Default Street View
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors';
    }

    const newTileLayer = L.tileLayer(tileUrl, { attribution, maxZoom: 19 });
    newTileLayer.addTo(leafletMap.current);
    tileLayerRef.current = newTileLayer;
  }, [baseMap]);

  // Render GeoJSON Parcels as Distinct Separated Boxes with High Contrast Borders
  useEffect(() => {
    if (!leafletMap.current || !geoJsonData) return;

    if (geoJsonLayer.current) {
      leafletMap.current.removeLayer(geoJsonLayer.current);
    }

    const layer = L.geoJSON(geoJsonData as any, {
      style: (feature: any) => {
        const props = feature.properties;
        const isSelected = props.ulpin === selectedUlpin;

        // Color coding for distinct parcel boxes
        let fillColor = '#10B981'; // Green for verified
        let fillOpacity = 0.55;
        let strokeColor = '#065F46'; // Strong dark green border
        let weight = 2.5;

        if (activeLayers.courtDisputes && (props.disputeStatus === 'ACTIVE_DISPUTE' || props.status === 'DISPUTED')) {
          fillColor = '#EF4444';
          fillOpacity = 0.7;
          strokeColor = '#991B1B';
        } else if (activeLayers.masterPlanRoads && props.ulpin.endsWith('0')) {
          fillColor = '#A855F7';
          fillOpacity = 0.7;
          strokeColor = '#6B21A8';
        } else if (activeLayers.floodZones && props.ulpin.endsWith('5')) {
          fillColor = '#3B82F6';
          fillOpacity = 0.65;
          strokeColor = '#1E40AF';
        } else if (activeLayers.ownershipStatus && !props.ownershipVerified) {
          fillColor = '#F59E0B';
          fillOpacity = 0.65;
          strokeColor = '#92400E';
        } else if (activeLayers.landUseZoning) {
          if (props.landUse === 'Commercial') { fillColor = '#EC4899'; strokeColor = '#9D174D'; }
          if (props.landUse === 'Industrial') { fillColor = '#6B7280'; strokeColor = '#1F2937'; }
          if (props.landUse === 'Agricultural') { fillColor = '#84CC16'; strokeColor = '#3F6212'; }
        }

        if (isSelected) {
          fillColor = '#0284C7'; // Bright blue for selected parcel box
          fillOpacity = 0.85;
          strokeColor = '#0c4a6e';
          weight = 4;
        }

        return {
          fillColor,
          fillOpacity: activeLayers.parcelBoundaries ? fillOpacity : 0.05,
          color: strokeColor,
          weight: activeLayers.parcelBoundaries ? weight : 0,
          opacity: 1
        };
      },
      onEachFeature: (feature: any, layer: L.Layer) => {
        const p = feature.properties;
        
        // Permanent / Hover Tooltip for ULPIN & Survey #
        layer.bindTooltip(
          `<div class="p-1 text-xs font-sans">
            <span class="font-mono font-bold text-slate-900">${p.ulpin}</span><br/>
            <span class="text-slate-700">Survey #${p.surveyNumber}</span><br/>
            <span class="font-semibold text-emerald-700">${p.areaAcres} Acres</span>
          </div>`,
          { permanent: false, direction: 'top', className: 'custom-parcel-tooltip' }
        );

        layer.on({
          click: () => onSelectParcel(p.ulpin),
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({ fillOpacity: 0.85, weight: 3.5 });
          },
          mouseout: (e) => {
            if (geoJsonLayer.current) {
              geoJsonLayer.current.resetStyle(e.target);
            }
          }
        });
      }
    });

    layer.addTo(leafletMap.current);
    geoJsonLayer.current = layer;

    // Auto-fit map bounds to show all parcel boxes on load
    if (geoJsonData.features.length > 0) {
      try {
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
          leafletMap.current.fitBounds(bounds, { padding: [25, 25] });
        }
      } catch (e) {
        // Fallback
      }
    }
  }, [geoJsonData, selectedUlpin, activeLayers, onSelectParcel]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full bg-slate-100" />
    </div>
  );
};
