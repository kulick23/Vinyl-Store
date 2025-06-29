import React, { useState, useEffect, useMemo } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useTranslation } from "react-i18next"
import { useGetReleasesQuery, useGetReleaseListingsQuery } from "../../redux/catalog/api"
import { useAddCartItemMutation } from "../../redux/cart/api"
import { useGetCurrentUserQuery } from "../../redux/auth/api"
import { useNotification } from "../../hooks/useNotification"
import ShopFilters from "../../Components/ShopFilters/ShopFilters"
import VinylSpinner from "../../Components/VinylSpinner/VinylSpinner"
import { WishlistButton } from "../../Components/WishlistButton"
import { Link } from "react-router-dom"
import type { FilterOptions, VinylRecord } from "../../redux/catalog/types"
import "./ShopPage.scss"

export const ShopPage: React.FC = () => {
  const { t } = useTranslation()
  const PAGE_SIZE = 20

  const [page, setPage] = useState(1)
  const [items, setItems] = useState<VinylRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({ includePrice: true })

  // добавить состояние для показа/скрытия фильтров
  const [showFilters, setShowFilters] = useState(false)

  const { data: user } = useGetCurrentUserQuery(undefined, {
    skip: !localStorage.getItem("accessToken"),
  })
  const [addToCart] = useAddCartItemMutation()

  // теперь ключ запроса включает page & limit
  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...filters,
      keyword: searchQuery || undefined,
    }),
    [page, filters, searchQuery],
  )

  const { data: records = [], isLoading, error } = useGetReleasesQuery(queryParams)

  // сброс при смене фильтра / поиска
  useEffect(() => {
    setPage(1)
    setItems([])
  }, [searchQuery, filters])

  // накопление с дедупликацией
  useEffect(() => {
    setItems((prev) => {
      const all = page === 1 ? records : [...prev, ...records]
      return all.filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i)
    })
  }, [records, page])

  const hasMore = records.length === PAGE_SIZE

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters({ ...newFilters, includePrice: true })
  }

  const handleClearFilters = () => {
    setFilters({ includePrice: true })
    setSearchQuery("")
  }

  const { showSuccess, showError, showWarning } = useNotification()

  const handleAddToCart = async (recordId: number) => {
    if (!user) {
      showWarning("notifications.loginRequired")
      return
    }

    try {
      // First, fetch the listings for this release to get the inventory item ID
      const listingsResponse = await fetch(`/api/catalog/releases/${recordId}/listings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      
      if (!listingsResponse.ok) {
        throw new Error('Failed to fetch listings')
      }
      
      const listings = await listingsResponse.json()
      
      // Find an available listing (with quantity > 0)
      const availableListing = listings.find((listing: any) => listing.quantity > 0)
      
      if (!availableListing) {
        showError("notifications.noAvailableListings")
        return
      }

      await addToCart({
        inventoryItemId: availableListing.id,
        quantity: 1,
      }).unwrap()
      
      showSuccess("notifications.itemAdded")
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      showError("notifications.itemAddFailed")
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return <VinylSpinner size="large" />
    }

    if (error) {
      console.error("Error loading records:", error)
      return <div>Error loading records: {JSON.stringify(error)}</div>
    }

    if (!items || items.length === 0) {
      return <div>No records found</div>
    }

    return (
      <InfiniteScroll
        dataLength={items.length}
        next={() => setPage((prev) => prev + 1)}
        hasMore={Boolean(hasMore)}
        loader={<VinylSpinner size="small" />}
        endMessage={<p style={{ textAlign: "center" }}>{t("shop.noMore")}</p>}
        // убираем внутренний скролл
        scrollableTarget={undefined}
      >
        <div className="records-grid">
          {items.map((record) => (
            <div key={record.id} className="record-card">
              <Link to={`/product/${record.id}`} className="record-link">
                <div className="record-image">
                  <img
                    src={
                      record.imageUrl ||
                      "/placeholder.svg?height=250&width=250&query=vinyl record" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={`${record.title} by ${record.artist}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=250&width=250"
                    }}
                  />
                  {record.isOnSale && <div className="sale-badge">{t("shop.sale")}</div>}
                  <div className="wishlist-button-container" onClick={(e) => e.preventDefault()}>
                    <WishlistButton 
                      releaseId={record.id} 
                      variant="icon" 
                      className="shop-wishlist-button"
                    />
                  </div>
                </div>
                <div className="record-info">
                  <h3>{record.title}</h3>
                  <p className="artist">{record.artist}</p>
                  {record.genre && <p className="genre">{record.genre}</p>}
                  {record.year && <p className="year">{record.year}</p>}
                  {record.price && (
                    <div className="price-container">
                      {record.isOnSale && record.originalPrice && (
                        <span className="original-price">${record.originalPrice}</span>
                      )}
                      <span className="current-price">${record.price}</span>
                    </div>
                  )}
                </div>
              </Link>
              <button
                className="add-to-cart"
                onClick={(e) => {
                  e.preventDefault()
                  handleAddToCart(record.id)
                }}
              >
                {t("shop.addToCart")}
              </button>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    )
  }

  return (
    <section className="shoppage">
      {/* обёртка для scrollableTarget */}
      <div className="shop-container" id="infinite-scroll">
        <div className="shop-header">
          <h1>{t("shop.title")}</h1>
          <div className="header-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder={t("shop.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              {t("shop.filter.title")}
            </button>
          </div>
        </div>

        <div className="shop-content">
          <div className={`filters-sidebar ${showFilters ? "show" : ""}`}>
            <ShopFilters filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />
          </div>
          <div className="records-section">
            <InfiniteScroll
              dataLength={items.length}
              next={() => setPage((p) => p + 1)}
              hasMore={hasMore}
              loader={<VinylSpinner size="small" />}
              endMessage={<p style={{ textAlign: "center" }}>{t("shop.noMore")}</p>}
              style={{ overflow: "visible" }}     // <— вот это
            >
              <div className="records-grid">
                {items.map((record) => (
                  <div key={record.id} className="record-card">
                    <Link to={`/product/${record.id}`} className="record-link">
                      <div className="record-image">
                        <img
                          src={
                            record.imageUrl ||
                            "/placeholder.svg?height=250&width=250&query=vinyl record" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={`${record.title} by ${record.artist}`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=250&width=250"
                          }}
                        />
                        {record.isOnSale && <div className="sale-badge">{t("shop.sale")}</div>}
                        <div className="wishlist-button-container" onClick={(e) => e.preventDefault()}>
                          <WishlistButton 
                            releaseId={record.id} 
                            variant="icon" 
                            className="shop-wishlist-button"
                          />
                        </div>
                      </div>
                      <div className="record-info">
                        <h3>{record.title}</h3>
                        <p className="artist">{record.artist}</p>
                        {record.genre && <p className="genre">{record.genre}</p>}
                        {record.year && <p className="year">{record.year}</p>}
                        {record.price && (
                          <div className="price-container">
                            {record.isOnSale && record.originalPrice && (
                              <span className="original-price">${record.originalPrice}</span>
                            )}
                            <span className="current-price">${record.price}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <button
                      className="add-to-cart"
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(record.id)
                      }}
                    >
                      {t("shop.addToCart")}
                    </button>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShopPage
