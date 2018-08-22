import { connect } from 'react-redux'
import EnsAddresses from './EnsAddresses'
import { getENS, getName } from './EnsAddressesActions'

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.ens.loading,
    loaded: state.ens.loaded,
    records: state.ens.records,
    name: state.ens.name,
    address: state.ens.address
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGet: () => {
      dispatch(getENS())
    },
    onName: () => {
      dispatch(getName())
    }
  }
}

const EnsAddressesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EnsAddresses)

export default EnsAddressesContainer
