"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useGetReleasesQuery } from "../../redux/catalog/api"
import { useAddCartItemMutation } from "../../redux/cart/api"
import { useGetCurrentUserQuery } from "../../redux/auth/api"
import TitleWithButton from "../../Components/TitleWithButton/TitleWithButton"
import ShopFilters from "../../Components/ShopFilters/ShopFilters"
import VinylSpinner from "../../Components/VinylSpinner/VinylSpinner"
import { Link } from "react-router-dom"
import type { FilterOptions } from "../../redux/catalog/types"
import "./ShopPage.scss"

export const ShopPage: React.FC = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    includePrice: true,
  })
  const [showFilters, setShowFilters] = useState(false)

  const { data: user } = useGetCurrentUserQuery(undefined, {
    skip: !localStorage.getItem("accessToken"),
  })
  const [addToCart] = useAddCartItemMutation()

  const queryParams = useMemo(
    () => ({
      ...filters,
      keyword: searchQuery || undefined,
    }),
    [filters, searchQuery],
  )

  const { data: records = [], error, isLoading } = useGetReleasesQuery(queryParams)

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters({ ...newFilters, includePrice: true })
  }

  const handleClearFilters = () => {
    setFilters({ includePrice: true })
    setSearchQuery("")
  }

  const handleAddToCart = async (recordId: number) => {
    if (!user) {
      alert("Please log in to add items to cart")
      return
    }

    try {
      // For demo purposes, we'll use the record ID as inventory item ID
      // In a real app,
      await addToCart({
        userId: user.id,
        inventoryItemId: recordId,
        quantity: 1,
      })
      alert("Item added to cart!")
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      alert("Failed to add item to cart.")
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-spinner">
          <VinylSpinner size="large" />
          <p>{t("shop.loading")}</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="error-message">
          <p>{t("shop.errors.title")}</p>
          <p>{(error as any).data?.message ?? t("shop.errors.fetchError")}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            {t("shop.errors.retry")}
          </button>
        </div>
      )
    }

    if (records.length === 0) {
      return (
        <div className="empty-state">
          <p>{searchQuery || Object.keys(filters).length > 1 ? t("shop.noResults") : t("shop.noRecords")}</p>
        </div>
      )
    }

    return (
      <div className="records-grid">
        {records.map((record) => (
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
                <button className="favorite-button" onClick={(e) => e.preventDefault()}>
                  ❤
                </button>
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
    )
  }

  return (
    <section className="shoppage">
      <TitleWithButton />
      <div className="shop-container">
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
          <div className="records-section">{renderContent()}</div>
        </div>
      </div>
    </section>
  )
}

export default ShopPage
