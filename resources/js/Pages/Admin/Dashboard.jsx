import AdminLayout from "../../Layouts/AdminLayout";

export default function Dashboard(){
    return (
        <AdminLayout>
            <h1>
                Admin Dashboard
            </h1>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
                    <h3>Total Routes</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.total_routes}</p>
                </div>
                <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
                    <h3>Total Regions</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.total_regions}</p>
                </div>
                <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
                    <h3>Total Users</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.total_users}</p>
                </div>
                <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
                    <h3>Pending Submissions</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.pending_submissions}</p>
                </div>
            </div>
        </AdminLayout>
    )
}
