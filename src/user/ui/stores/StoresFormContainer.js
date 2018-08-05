import { connect } from 'react-redux'
import StoresForm from './StoresForm'
import { addStores, watchStores, getStores, setOwnerStore } from './StoresFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.stores.loading,
    loaded: state.stores.loaded,
    stores: state.stores.stores,
    watch: state.stores.watch
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAdd: (name, logo) => {
      dispatch(addStores(name, logo))
    },
    onWatch: () => {
      dispatch(watchStores())
    },
    onGet: () => {
      dispatch(getStores())
    },
    onSetStore: (storeInfo) => {
      dispatch(setOwnerStore(storeInfo))
    }
  }
}

const StoresFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StoresForm)

export default StoresFormContainer
