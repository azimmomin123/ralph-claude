"""create_core_tables

Revision ID: 40f1d5bec38e
Revises:
Create Date: 2026-01-22 19:35:13.658600

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '40f1d5bec38e'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - add seller_marketplaces and vendors tables."""
    # Create seller_marketplaces table
    op.create_table('seller_marketplaces',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('seller_id', sa.UUID(), nullable=False),
    sa.Column('marketplace_id', sa.String(length=20), nullable=False),
    sa.Column('amazon_seller_id', sa.String(length=50), nullable=True),
    sa.Column('sp_api_client_id', sa.String(length=255), nullable=True),
    sa.Column('sp_api_client_secret_encrypted', sa.Text(), nullable=True),
    sa.Column('sp_api_refresh_token_encrypted', sa.Text(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('last_sync_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['seller_id'], ['sellers.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('seller_id', 'marketplace_id', name='uq_seller_marketplace')
    )

    # Create vendors table
    op.create_table('vendors',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('seller_id', sa.UUID(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('contact_name', sa.String(length=255), nullable=True),
    sa.Column('email', sa.String(length=255), nullable=True),
    sa.Column('phone', sa.String(length=50), nullable=True),
    sa.Column('address', sa.Text(), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['seller_id'], ['sellers.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )

    # Add foreign key constraint to sync_jobs if not exists
    # (we skip this since it may fail if constraint already exists)


def downgrade() -> None:
    """Downgrade schema - remove seller_marketplaces and vendors tables."""
    op.drop_table('vendors')
    op.drop_table('seller_marketplaces')
