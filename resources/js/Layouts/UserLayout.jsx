export default function UserLayout({children}){
    return (
        <div>
            <nav style={{ background: '#2d6a4f', padding: '10px 20px', color: 'white', display: 'flex', gap: '20px' }}>
                <a href="/home" style={{color:'white'}}>Home</a>
                <a href="/aichat" style={{color:'white'}}>AI Chat</a>
                <a href="/trips" style={{color:'white'}}>My Trips</a>
            </nav>
            <div style={{padding: '20px'}}>
                {children}
            </div>
        </div>
    )
}
