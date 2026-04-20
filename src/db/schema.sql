-- Enable geospatial support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id     VARCHAR(255) UNIQUE,
  name          VARCHAR(255) NOT NULL,
  segment       VARCHAR(100),
  address       TEXT,
  phone         VARCHAR(50),
  website       VARCHAR(500),
  rating        NUMERIC(2,1),
  review_count  INTEGER DEFAULT 0,
  location      GEOGRAPHY(POINT, 4326),
  raw_data      JSONB,                   
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for fast radius queries
CREATE INDEX IF NOT EXISTS idx_businesses_location
  ON businesses USING GIST(location);

-- Index for segment filtering
CREATE INDEX IF NOT EXISTS idx_businesses_segment
  ON businesses(segment);