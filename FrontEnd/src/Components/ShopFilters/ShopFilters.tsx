import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetGenresQuery, useGetArtistsQuery } from '../../redux/catalog/api';
import type { FilterOptions } from '../../redux/catalog/types';
import './ShopFilters.scss';

interface ShopFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export const ShopFilters: React.FC<ShopFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const { t } = useTranslation();
  const { data: genres = [] } = useGetGenresQuery();
  const { data: artists = [] } = useGetArtistsQuery();

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  const sortOptions = [
    { value: '', label: t('shop.filter.sortBy') },
    { value: 'title_asc', label: t('shop.filter.titleAsc') },
    { value: 'title_desc', label: t('shop.filter.titleDesc') },
    { value: 'price_asc', label: t('shop.filter.priceAsc') },
    { value: 'price_desc', label: t('shop.filter.priceDesc') },
    { value: 'year_asc', label: t('shop.filter.yearAsc') },
    { value: 'year_desc', label: t('shop.filter.yearDesc') },
  ];

  return (
    <div className="shop-filters">
      <div className="filters-header">
        <h3>{t('shop.filter.title')}</h3>
        <button className="clear-filters-btn" onClick={onClearFilters}>
          {t('shop.filter.clear')}
        </button>
      </div>

      <div className="filter-group">
        <label>{t('shop.filter.genre')}</label>
        <select
          value={filters.genreId || ''}
          onChange={(e) =>
            handleFilterChange('genreId', Number(e.target.value) || undefined)
          }
        >
          <option value="">{t('shop.filter.allGenres')}</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>{t('shop.filter.artist')}</label>
        <select
          value={filters.artistId || ''}
          onChange={(e) =>
            handleFilterChange('artistId', Number(e.target.value) || undefined)
          }
        >
          <option value="">{t('shop.filter.allArtists')}</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>{t('shop.filter.priceRange')}</label>
        <div className="price-inputs">
          <input
            type="number"
            placeholder={t('shop.filter.minPrice')}
            value={filters.priceMin || ''}
            onChange={(e) =>
              handleFilterChange(
                'priceMin',
                Number(e.target.value) || undefined
              )
            }
          />
          <span>-</span>
          <input
            type="number"
            placeholder={t('shop.filter.maxPrice')}
            value={filters.priceMax || ''}
            onChange={(e) =>
              handleFilterChange(
                'priceMax',
                Number(e.target.value) || undefined
              )
            }
          />
        </div>
      </div>

      <div className="filter-group">
        <label>{t('shop.filter.yearRange')}</label>
        <div className="year-inputs">
          <input
            type="number"
            placeholder={t('shop.filter.yearFrom')}
            value={filters.yearFrom || ''}
            onChange={(e) =>
              handleFilterChange(
                'yearFrom',
                Number(e.target.value) || undefined
              )
            }
          />
          <span>-</span>
          <input
            type="number"
            placeholder={t('shop.filter.yearTo')}
            value={filters.yearTo || ''}
            onChange={(e) =>
              handleFilterChange('yearTo', Number(e.target.value) || undefined)
            }
          />
        </div>
      </div>

      <div className="filter-group">
        <label>{t('shop.filter.condition')}</label>
        <select
          value={filters.condition || ''}
          onChange={(e) =>
            handleFilterChange('condition', Number(e.target.value) || undefined)
          }
        >
          <option value="">{t('shop.filter.allConditions')}</option>
          <option value={1}>{t('shop.filter.poor')}</option>
          <option value={2}>{t('shop.filter.fair')}</option>
          <option value={3}>{t('shop.filter.good')}</option>
          <option value={4}>{t('shop.filter.veryGood')}</option>
          <option value={5}>{t('shop.filter.nearMint')}</option>
          <option value={6}>{t('shop.filter.mint')}</option>
        </select>
      </div>
    </div>
  );
};

export default ShopFilters;
