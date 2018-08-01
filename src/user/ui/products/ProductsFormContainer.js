import { connect } from 'react-redux'
import ProductsForm from './ProductsForm'
import { addProducts, watchProducts, changeProductsStoreName } from './ProductsFormActions'
import { watchStores  } from '../stores/StoresFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    stores: state.stores,
    name: state.products.name,
    loading: state.products.loading,
    loaded: state.products.loaded,
    products: state.products.products
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAdd: (name, id, quantity, price, description) => {
      dispatch(addProducts(name, id, quantity, price, description))
    },
    onWatch: (name) => {
      dispatch(watchProducts(name))
    },
    onWatchStores: (fromBlock) => {
      dispatch(watchStores(fromBlock))
    },
    onStoreChange: (name) => {
      dispatch(changeProductsStoreName(name))
    }
  }
}

const ProductsFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsForm)

export default ProductsFormContainer
