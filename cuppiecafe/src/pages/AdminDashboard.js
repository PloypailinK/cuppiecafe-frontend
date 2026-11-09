import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  const cards = [
    {
      title: "จัดการสมาชิก",
      description: "ตรวจสอบและจัดการบัญชีสมาชิก",
      icon: "♙",
      label: "MEMBERS",
      path: "/admin/members",
    },
    {
      title: "จัดการคาเฟ่",
      description: "เพิ่ม แก้ไข และปิดใช้งานข้อมูลคาเฟ่",
      icon: "☕",
      label: "CAFES",
      path: "/admin/cafes",
    },
    {
      title: "จัดการรีวิว",
      description: "ตรวจสอบความคิดเห็นและจัดการรีวิว",
      icon: "✎",
      label: "REVIEWS",
      path: "/admin/reviews",
    },
  ];

  const adminInitial = (
    user?.name ||
    user?.email ||
    "A"
  ).charAt(0).toUpperCase();

  return (
    <div className="space-y-8">

      {/* WELCOME BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#754A30] to-[#493629] rounded-2xl p-6 md:p-9 text-white shadow-sm">

        {/* DECORATION */}
        <div className="absolute right-8 -top-16 w-52 h-52 rounded-full border border-white/10" />

        <div className="absolute right-20 -top-5 w-36 h-36 rounded-full border border-white/10" />

        <div className="absolute right-[-35px] bottom-[-100px] w-56 h-56 rounded-full bg-white/5" />

        <svg
          className="absolute right-0 bottom-0 w-64 h-full opacity-20 pointer-events-none"
          viewBox="0 0 250 150"
          fill="none"
        >
          <path
            d="M90 150 C130 120 100 90 155 70 C190 55 210 75 260 25"
            stroke="#F8EBDD"
            strokeWidth="1.5"
          />
          <path
            d="M120 150 C155 125 135 100 180 90 C210 82 230 95 265 55"
            stroke="#F8EBDD"
            strokeWidth="1.5"
          />
        </svg>

        <div className="relative z-10 max-w-2xl">
          <p className="text-xs tracking-[0.2em] text-[#E5C4A5] mb-3">
            WELCOME BACK, ADMINISTRATOR
          </p>

          <h1 className="text-2xl md:text-3xl font-bold">
            ยินดีต้อนรับสู่ Cuppie Admin
          </h1>

          <p className="text-sm text-[#E8D8CA] mt-3 leading-relaxed">
            จัดการข้อมูลสมาชิก คาเฟ่ และรีวิวทั้งหมด
            ได้จากพื้นที่จัดการระบบของคุณ
          </p>
        </div>
      </section>

      {/* MANAGEMENT HEADER */}
      <section>
        <div className="mb-6">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#A87852]">
            SYSTEM OVERVIEW
          </p>

          <h2 className="text-2xl font-bold text-[#493629] mt-1">
            ภาพรวมการจัดการ
          </h2>

          <p className="text-sm text-[#82766C] mt-1">
            เลือกส่วนงานที่ต้องการจัดการ
          </p>
        </div>

        {/* MANAGEMENT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

          {cards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className="group bg-white rounded-2xl border border-[#EFE5DB] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#D8B99F] transition-all duration-300"
            >

              {/* CARD HEADER */}
              <div className="flex items-start justify-between">

                <div className="w-12 h-12 rounded-xl bg-[#F5EDE5] text-[#754A30] flex items-center justify-center text-2xl group-hover:bg-[#754A30] group-hover:text-white transition-colors duration-300">
                  {card.icon}
                </div>

                <span className="text-[10px] tracking-widest font-semibold text-[#B9A99B]">
                  {card.label}
                </span>
              </div>

              {/* CARD CONTENT */}
              <div className="mt-5">
                <h3 className="text-lg font-bold text-[#493629] group-hover:text-[#A87852] transition-colors">
                  {card.title}
                </h3>

                <p className="text-sm text-[#82766C] mt-2 leading-relaxed min-h-[40px]">
                  {card.description}
                </p>
              </div>

              {/* ACTION BUTTON */}
              <div className="relative overflow-hidden flex items-center justify-between mt-6 px-4 py-3 rounded-xl bg-gradient-to-r from-[#754A30] to-[#60402F] group-hover:from-[#68432F] group-hover:to-[#493629] transition-all duration-300">

                {/* ORGANIC WAVES */}
                <svg
                  className="absolute right-0 top-0 h-full w-36 opacity-30 group-hover:opacity-55 transition-opacity duration-500 pointer-events-none"
                  viewBox="0 0 150 60"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M45 60 C65 48 55 36 78 27 C96 20 108 28 150 4"
                    stroke="#F8EBDD"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />

                  <path
                    d="M65 60 C82 49 72 40 94 34 C116 28 123 37 155 18"
                    stroke="#F8EBDD"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />

                  <path
                    d="M88 60 C104 53 98 45 118 43 C135 40 140 47 160 35"
                    stroke="#F8EBDD"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>

                {/* BUTTON TEXT */}
                <div className="relative z-10 flex items-center gap-2">
                  <span className="text-sm text-[#F8EBDD]">
                    {card.icon}
                  </span>

                  <span className="text-sm font-medium text-[#F8EBDD]">
                    เข้าสู่การจัดการ
                  </span>
                </div>

                {/* ARROW */}
                <span className="relative z-10 text-lg text-[#F8EBDD] group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </div>
            </Link>
          ))}

        </div>
      </section>

      {/* ADMIN PROFILE */}
      <section className="bg-white rounded-2xl border border-[#EFE5DB] p-6 md:p-8 shadow-sm">

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">

          {/* AVATAR */}
          <div className="w-16 h-16 rounded-full bg-[#F0E4D8] flex items-center justify-center text-2xl font-bold text-[#754A30] shrink-0">
            {adminInitial}
          </div>

          {/* ACCOUNT INFORMATION */}
          <div className="flex-1 min-w-0">
            <p className="text-xs tracking-widest text-[#A87852] font-semibold">
              ADMIN PROFILE
            </p>

            <h3 className="text-xl font-bold text-[#493629] mt-1">
              {user?.name || "Administrator"}
            </h3>

            <p className="text-sm text-[#82766C] mt-1 break-all">
              {user?.email}
            </p>
          </div>

          {/* ROLE */}
          <div>
            <span className="inline-flex items-center gap-2 bg-[#EDF4E9] text-[#52734B] px-4 py-2 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#6D9A61]" />
              {user?.role || "admin"}
            </span>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-3">
        <p className="text-[10px] tracking-widest text-[#B0A397]">
          CUPPIE ADMIN PANEL · DISCOVER YOUR LITTLE HAPPY PLACE
        </p>
      </footer>

    </div>
  );
}

export default AdminDashboard;