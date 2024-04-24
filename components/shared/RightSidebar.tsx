import "@/app/globals.css";

function RightSidebar() {
    return (
        
        <section className="custom-scrollbar rightsidebar bg-[#0f0f20]">
            <div className="absolute inset-y-0 left-0 transform -rotate-90">
    <div className="animation-container">
      <div className="lightning-container">
        <div className="lightning white"></div>
        <div className="lightning red"></div>
      </div>
      <div className="boom-container">
        <div className="shape circle big white"></div>
        <div className="shape circle white"></div>
        <div className="shape triangle big yellow"></div>
        <div className="shape disc white"></div>
        <div className="shape triangle blue"></div>
      </div>
      <div className="boom-container second">
        <div className="shape circle big white"></div>
        <div className="shape circle white"></div>
        <div className="shape disc white"></div>
        <div className="shape triangle blue"></div>
      </div>
    </div>
  </div>
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-yellow-100">Suggested Communities</h3>
            </div>
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-yellow-100" >Suggested Users</h3>
            </div>
            <div className='w-full max-w-4xl relative z-10'>
  
</div>

        </section>

    )
}

export default RightSidebar;