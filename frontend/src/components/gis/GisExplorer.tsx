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

  // Initialize Map Instance
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Visakhapatnam center coordinates
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

  // Update Tile Layer according to baseMap selection
  useEffect(() => {
    if (!leafletMap.current) return;

    if (tileLayerRef.current) {
      leafletMap.current.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';

    if (baseMap === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri';
    } else if (baseMap === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO';
    }

    const newTileLayer = L.tileLayer(tileUrl, { attribution, maxZoom: 19 });
    newTileLayer.addTo(leafletMap.current);
    tileLayerRef.current = newTileLayer;
  }, [baseMap]);

  // Render & Style GeoJSON Parcels with active layers
  useEffect(() => {
    if (!leafletMap.current || !geoJsonData) return;

    if (geoJsonLayer.current) {
      leafletMap.current.removeLayer(geoJsonLayer.current);
    }

    const layer = L.geoJSON(geoJsonData as any, {
      style: (feature: any) => {
        const props = feature.properties;
        const isSelected = props.ulpin === selectedUlpin;

        let fillColor = '#10B981'; // Green for verified
        let fillOpacity = 0.45;
        let color = '#059669';
        let weight = isSelected ? 3 : 1;

        if (activeLayers.courtDisputes && (props.disputeStatus === 'ACTIVE_DISPUTE' || props.status === 'DISPUTED')) {
          fillColor = '#EF4444';
          fillOpacity = 0.65;
          color = '#DC2626';
        } else if (activeLayers.masterPlanRoads && props.ulpin.endsWith('0')) {
          // Highlight road expansion affected parcels
          fillColor = '#A855F7';
          fillOpacity = 0.65;
          color = '#7E22CE';
        } else if (activeLayers.floodZones && props.ulpin.endsWith('5')) {
          fillColor = '#3B82F6';
          fillOpacity = 0.6;
          color = '#1D4ED8';
        } else if (activeLayers.ownershipStatus && !props.ownershipVerified) {
          fillColor = '#F59E0B';
          fillOpacity = 0.55;
          color = '#D97706';
        } else if (activeLayers.landUseZoning) {
          if (props.landUse === 'Commercial') fillColor = '#EC4899';
          if (props.landUse === 'Industrial') fillColor = '#6B7280';
          if (props.landUse === 'Agricultural') fillColor = '#84CC16';
        }

        if (isSelected) {
          fillColor = '#3B82F6';
          fillOpacity = 0.8;
          color = '#1D4ED8';
          weight = 4;
        }

        return {
          fillColor,
          fillOpacity: activeLayers.parcelBoundaries ? fillOpacity : 0.05,
          color: activeLayers.parcelBoundaries ? color : 'transparent',
          weight
        };
      },
      onEachFeature: (feature: any, layer: L.Layer) => {
        const p = feature.properties;
        if (activeLayers.ulpinLabels) {
          layer.bindTooltip(
            `<div class="text-xs font-semibold"><b>${p.ulpin}</b><br/>Survey: ${p.surveyNumber}<br/>${p.areaAcres} Acres</div>`,
            { permanent: false, direction: 'top' }
          );
        }
        layer.on({
          click: () => onSelectParcel(p.ulpin)
        });
      }
    });

    layer.addTo(leafletMap.current);
    geoJsonLayer.current = layer;

    // Fit map bounds to encompass all parcel boxes on load
    if (geoJsonData.features.length > 0) {
      try {
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
          leafletMap.current.fitBounds(bounds, { padding: [20, 20] });
        }
      } catch (e) {
        // Fallback zoom
      }
    }
  }, [geoJsonData, selectedUlpin, activeLayers, onSelectParcel]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full bg-slate-900" />
    </div>
  );
};
