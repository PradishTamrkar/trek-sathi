export default function AdminLayout({children}){
    return(
        <div>
            <nav style={{ background: '#1a1a2e', padding: '10px 20px', color: 'white', display: 'flex', gap: '20px'}}>
                <a href="/admin/dashboard" style={{color: 'white'}}>Dashboard</a>
                <a href="/admin/trekking-routes" style={{color: 'white'}}>Trekking Routes</a>
                <a href="/admin/regions" style={{color:'white'}}>Regions</a>
            </nav>
            <div style={{padding:'20px'}}>
                {children}
            </div>
        </div>
    )
}
