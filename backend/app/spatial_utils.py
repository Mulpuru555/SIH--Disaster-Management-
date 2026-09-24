import math
from typing import Dict, Any, List

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees) using the Haversine formula.
    """
    r = 6371.0  # Earth radius in kilometers
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r * c, 2)

def point_to_geojson_feature(
    id_: str,
    lat: float,
    lng: float,
    properties: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Convert a point with properties into an RFC 7946 compliant GeoJSON Feature.
    Coordinates are in [longitude, latitude] order as per GeoJSON specification.
    """
    return {
        "type": "Feature",
        "id": id_,
        "geometry": {
            "type": "Point",
            "coordinates": [round(lng, 6), round(lat, 6)]
        },
        "properties": properties
    }

def linestring_to_geojson_feature(
    id_: str,
    coords: List[List[float]],
    properties: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Convert a line coordinate list [[lon, lat], ...] into an RFC 7946 compliant GeoJSON Feature.
    """
    return {
        "type": "Feature",
        "id": id_,
        "geometry": {
            "type": "LineString",
            "coordinates": coords
        },
        "properties": properties
    }

def create_feature_collection(features: List[Dict[str, Any]], title: str = "ResQGrid Spatial Data") -> Dict[str, Any]:
    """
    Package GeoJSON features into a FeatureCollection with bounding box calculation.
    """
    lons = []
    lats = []
    for f in features:
        geom = f.get("geometry", {})
        gtype = geom.get("type")
        coords = geom.get("coordinates", [])
        if gtype == "Point" and len(coords) >= 2:
            lons.append(coords[0])
            lats.append(coords[1])
        elif gtype == "LineString":
            for pt in coords:
                if len(pt) >= 2:
                    lons.append(pt[0])
                    lats.append(pt[1])

    bbox = [min(lons), min(lats), max(lons), max(lats)] if lons and lats else [0, 0, 0, 0]

    return {
        "type": "FeatureCollection",
        "metadata": {
            "title": title,
            "crs": "urn:ogc:def:crs:OGC:1.3:CRS84",
            "count": len(features)
        },
        "bbox": bbox,
        "features": features
    }

def point_in_polygon(lat: float, lng: float, polygon_ring: List[List[float]]) -> bool:
    """
    Ray-casting algorithm to test if point (lat, lng) is inside a GeoJSON polygon ring.
    polygon_ring contains [[lon, lat], ...].
    """
    inside = False
    n = len(polygon_ring)
    if n < 3:
        return False
    j = n - 1
    for i in range(n):
        xi, yi = polygon_ring[i][0], polygon_ring[i][1]  # lon, lat
        xj, yj = polygon_ring[j][0], polygon_ring[j][1]

        intersect = ((yi > lat) != (yj > lat)) and (lng < (xj - xi) * (lat - yi) / ((yj - yi) + 1e-12) + xi)
        if intersect:
            inside = not inside
        j = i
    return inside

def polygon_to_geojson_feature(
    id_: str,
    coordinates: List[List[List[float]]],
    properties: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Convert polygon rings into an RFC 7946 compliant GeoJSON Feature.
    """
    return {
        "type": "Feature",
        "id": id_,
        "geometry": {
            "type": "Polygon",
            "coordinates": coordinates
        },
        "properties": properties
    }

