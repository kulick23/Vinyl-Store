import type React from "react"
import { useTranslation } from "react-i18next"

const SellerProfile: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="seller-profile">
      <h2 className="section-title">{t('seller.sellerProfile')}</h2>
      
      <div className="info-message">
        <h3>Profile Management Coming Soon</h3>
        <p>
          Seller profile management features are currently being developed. 
          For now, you can manage your inventory and orders through the other dashboard sections.
        </p>
        
        <div className="available-features">
          <h4>Available Features:</h4>
          <ul>
            <li>✅ Inventory Management</li>
            <li>✅ Order Tracking</li>
            <li>🚧 Profile Editing (Coming Soon)</li>
            <li>🚧 Shop Reviews (Coming Soon)</li>
            <li>🚧 Avatar Upload (Coming Soon)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SellerProfile 