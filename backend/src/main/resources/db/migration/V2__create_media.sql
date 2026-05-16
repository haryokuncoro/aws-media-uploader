CREATE TABLE media (
                       id UUID PRIMARY KEY,
                       user_id UUID NOT NULL,
                       file_key VARCHAR(500) NOT NULL,
                       file_url TEXT,
                       thumbnail_url TEXT,
                       media_type VARCHAR(20),
                       status VARCHAR(20),
                       size BIGINT,
                       created_at TIMESTAMP
);