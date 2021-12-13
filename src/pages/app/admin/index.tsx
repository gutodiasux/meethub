import { withSSRAuth } from "../../../utils/withSSRAuth";
import { setupAPIClient } from "../../../services/api";
import { AdminHeader } from "../../../components/AdminHeader";


export default function Admin() {

  return (
    <>
      <AdminHeader />
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me');

  return {
    props: {}
  }
}, {
  roles: ['administrator'],
})