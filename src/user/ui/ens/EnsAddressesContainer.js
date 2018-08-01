import { connect } from 'react-redux'
import EnsAddresses from './EnsAddresses'
import { getENS } from './EnsAddressesActions'

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.ens.loading,
    loaded: state.ens.loaded,
    records: state.ens.records
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGet: () => {
      dispatch(getENS())
    }
  }
}

const EnsAddressesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EnsAddresses)

export default EnsAddressesContainer
