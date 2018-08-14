import { connect } from 'react-redux'
import DeployForm from './DeployForm'
import { deployMarket, getManagerAddress, deployStoreOwners } from './DeployFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    web3: state.web3.web3Instance,
    manager: state.web3.manager,
    market: state.web3.market,
    storage: state.web3.storage,
    owners: state.web3.owners,
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
