import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Seller(Base):
    """Seller account linked to Supabase user."""
    __tablename__ = "sellers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    supabase_user_id = Column(UUID(as_uuid=True), unique=True, nullable=False)
    email = Column(String(255), nullable=False)
    company_name = Column(String(255))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    marketplaces = relationship("SellerMarketplace", back_populates="seller", cascade="all, delete-orphan")
    vendors = relationship("Vendor", back_populates="seller", cascade="all, delete-orphan")


class SellerMarketplace(Base):
    """Amazon marketplace connection for a seller."""
    __tablename__ = "seller_marketplaces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("sellers.id", ondelete="CASCADE"), nullable=False)
    marketplace_id = Column(String(20), nullable=False)
    amazon_seller_id = Column(String(50))
    sp_api_client_id = Column(String(255))
    sp_api_client_secret_encrypted = Column(Text)
    sp_api_refresh_token_encrypted = Column(Text)
    is_active = Column(Boolean, default=True)
    last_sync_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    seller = relationship("Seller", back_populates="marketplaces")

    __table_args__ = (
        UniqueConstraint('seller_id', 'marketplace_id', name='uq_seller_marketplace'),
    )


class Vendor(Base):
    """Vendor/supplier information."""
    __tablename__ = "vendors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("sellers.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    contact_name = Column(String(255))
    email = Column(String(255))
    phone = Column(String(50))
    address = Column(Text)
    notes = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    seller = relationship("Seller", back_populates="vendors")
