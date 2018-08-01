import { connect } from 'react-redux'
import OwnersForm from './OwnersForm'
import { addOwner, watchOwners, getOwners } from './OwnersFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    name: state.owners.name,
    address:state.owners.address,
    loading: state.owners.loading,
    loaded: state.owners.loaded,
    owners: state.owners.owners,
    watch: state.owners.watch
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAdd: (owner, name) => {
      dispatch(addOwner(owner, name))
    },
    onWatch: () => {
      dispatch(watchOwners())
    },
    onGet: () => {
      dispatch(getOwners())
    }
  }
}

const OwnersFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OwnersForm)

export default OwnersFormContainer
