import { connect } from 'react-redux'
import StoreProductList from './StoreProductList'
import { getProducts } from '../products/ProductsFormActions'
import { describeOrder } from '../order/OrderFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    name: state.products.name,
    loading: state.products.loading,
    loaded: state.products.loaded,
    products: state.products.products
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGet: (name) => {
      dispatch(getProducts(name))
    },
    onSelect: (orderDesc) => {
      dispatch(describeOrder(orderDesc))
    }
  }
}

const ProductListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StoreProductList)

export default ProductListContainer
