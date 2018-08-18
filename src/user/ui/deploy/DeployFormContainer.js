import { connect } from 'react-redux'
import DeployForm from './DeployForm'
import { deployMarket, getManagerAddress, deployStoreOwners, deployStores, deployCustomers } from './DeployFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    web3: state.web3.web3Instance,
    manager: state.web3.manager,
    market: state.web3.market,
    storage: state.web3.storage,
    owners: state.web3.owners,
    stores: state.web3.stores,
    customers: state.web3.customers,
    loading: state.web3.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onMarket: () => {
      dispatch(deployMarket())
    },
    onOwners: () => {
      dispatch(deployStoreOwners())
    },
    onStores: () => {
      dispatch(deployStores())
    },
    onCustomers: () => {
      dispatch(deployCustomers())
    },
    onGetMgr: () => {
      dispatch(getManagerAddress())
    }
  }
}

const DeployFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeployForm)

export default DeployFormContainer
