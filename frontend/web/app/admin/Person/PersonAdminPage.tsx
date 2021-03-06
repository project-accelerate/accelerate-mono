import React from 'react'
import { AdminCrudView } from 'frontend.web/app/admin/common/AdminCrudView/AdminCrudView'
import { createDataLoader } from 'frontend.web/app/common/LoadData/LoadData'
import {
  PersonAdminPageQuery,
  CreatePersonRequest,
  EditPersonRequest,
} from 'frontend.web/queries'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { PersonAdminCard } from './PersonAdminCard'
import { EditPersonForm } from './EditPersonForm'
import { Main } from 'frontend.web/app/common/Layouts'

interface PersonAdminPageProps {
  client: ApolloClient<{}>
}

interface RequestAddProps extends CreatePersonRequest {
  // Workaround for Apollo incorectly treating Upload as string
  photoUpload?: any
}

interface RequestEditProps extends EditPersonRequest {
  // Workaround for Apollo incorectly treating Upload as string
  photoUpload?: any
  
}



export const PersonAdminPage = withApollo(
  class PersonAdminPage extends React.Component<PersonAdminPageProps> {
    handleRequestAdd = async (req: RequestAddProps) => {
      await this.props.client.mutate({
        mutation: require('./CreatePerson.graphql'),
        variables: {
          req,
        },
      })

      await this.props.client.resetStore()
    }

    handleRequestEdit = async (req: RequestEditProps) => {
      await this.props.client.mutate({
        mutation: require('./EditPerson.graphql'),
        variables: {
          req,
        },
      })

      await this.props.client.resetStore()
    }

    render() {
      return (
        <Main>
          <LoadData variables={{}}>
            {({ data }) => (
              <AdminCrudView
                items={data.allPeople.edges.map(e => e.node)}
                renderAddItem={({ onSave, onCancel }) => (
                  <EditPersonForm
                    title="New Speaker"
                    onSave={onSave}
                    onCancel={onCancel}
                  />
                )}
                renderEditItem={({ value, onSave, onCancel }) => (
                  <EditPersonForm
                    title="Edit Speaker"
                    initial={{
                      id: value.id || '',
                      name: value.name || '',
                      bio: value.bio || '',
                      twitterHandle: value.twitterHandle || '',
                      profilePic: value.photo
                        ? value.photo.sourceUrl
                        : undefined,
                    }}
                    onCancel={onCancel}
                    onSave={onSave}
                  />
                )}
                renderListItem={({ value, onEdit }) => (
                  <PersonAdminCard onEdit={onEdit} person={value} />
                )}
                onAddItem={this.handleRequestAdd}
                onEditItem={this.handleRequestEdit}
                addSuccessMessage="Speaker added to conference"
              />
            )}
          </LoadData>
        </Main>
      )
    }
  },
)

const LoadData = createDataLoader<PersonAdminPageQuery, {}>(
  require('./PersonAdminPage.graphql'),
)
