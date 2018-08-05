import { connect } from 'react-redux'
import ProductsForm from './ProductsForm'
import { addProducts, watchProducts, getProducts, changeProductsStoreName, resetProductsLoaded } from './ProductsFormActions'
import { getStores  } from '../stores/StoresFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    stores: state.stores,
    name: state.products.name,
    loading: state.products.loading,
    loaded: state.products.loaded,
    products: state.products.products,
    watch: state.products.watch
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
    onGet: (name) => {
      dispatch(getProducts(name))
    },
    onGetStores: () => {
      dispatch(getStores())
    },
    onReset: () => {
      dispatch(resetProductsLoaded())
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
