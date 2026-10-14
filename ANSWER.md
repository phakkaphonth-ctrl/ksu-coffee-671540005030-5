# ANSWER — นายภัคพล ทองจรัส 671540005030-5

- Platform: Vercel
- Production URL: https://ksu-coffee-671540005030-5.vercel.app

## คำตอบ

1. เลือก Vercel ซึ่งรันแบบ Serverless (แต่ละคำขอ `/api/info` รัน `api/info.js` เป็น function ที่ถูกเรียกเมื่อมีคำขอ) บน production ไม่ได้ใช้ `server.js` เพราะ Vercel เสิร์ฟหน้าเว็บจากโฟลเดอร์ `public/` ตาม `vercel.json` เอง และไม่มี Start Command ส่วน `server.js` เป็นเซิร์ฟเวอร์ที่ต้องรันค้างไว้ ใช้ทดสอบในเครื่องหรือบนแพลตฟอร์มแบบ container เช่น Render

2. ตั้ง `STUDENT_ID` ที่ Vercel ในหน้า Environment Variables ของโปรเจกต์ (ตอน import repo ก่อนกด Deploy) ห้าม commit `.env` เพราะ repo เป็น Public ค่าลับจะหลุดและลบออกจากประวัติ git ยาก (`.gitignore` จึงกัน `*.env` ไว้) ถ้า `/api/info` ขึ้น `NOT SET` อาจเกิดจาก: เพิ่มตัวแปรหลัง deploy แล้วไม่ได้ Redeploy, สะกดชื่อผิด (ต้องเป็น `STUDENT_ID` พิมพ์ใหญ่), เลือก environment ไม่ตรง (Production/Preview) หรือตั้งผิดโปรเจกต์

3. ครั้งแรก 1.033 วินาที / ครั้งที่สอง 0.404 วินาที — ต่างกัน ครั้งแรกช้ากว่าราว 2.5 เท่า เหตุผลที่น่าจะเป็นคือ cold start (Serverless ต้องเริ่ม instance ของ function ใหม่ถ้าไม่มีคนเรียกมาสักพัก) ส่วนครั้งที่สองใช้ instance ที่อุ่นอยู่แล้ว ไม่ใช่ผลของ cache เพราะ response ตั้ง `Cache-Control: no-store` และ `X-Vercel-Cache: MISS` ทั้งสองครั้ง (วัดครั้งเดียวต่อชุด จึงสรุปสาเหตุได้ไม่เด็ดขาด เวลาที่เหลือราว 0.4 วินาทีมาจากระยะทางเครือข่าย)

4. `git push` → GitHub แจ้ง Vercel ผ่าน Git integration → Vercel ดึงโค้ดตาม commit นั้นมา build (ไม่มี build command ใช้ `public/` เป็น output และ deploy `api/info.js` เป็น function) → สลับ production ไปชี้ deployment ใหม่ → หน้าเปลี่ยนเป็น `Menu v2` ค่า `commit` ใน `/api/info` มาจากตัวแปรของแพลตฟอร์ม (`VERCEL_GIT_COMMIT_SHA`) ตรวจแล้วเป็น `3c9659a6ddef13be30ee2717951b18e7aee44899` ตรงกับ `git log -1 --format=%H` ของ commit `feat: menu v2 add new item` ทุกตัวอักษร

5. ตรง ๆ ไม่ได้ เพราะ Vercel เป็น Serverless ไม่รัน container และไม่รองรับ `docker-compose.yml` ส่วน service `promo` เป็น Docker image ที่ต้องรัน nginx ค้างไว้ที่ port 3000 ซึ่ง Vercel รันไม่ได้ ส่วน `menu` เป็นไฟล์ static จึงแยกไป deploy บน Vercel ได้ ถ้าจะใช้ทั้งระบบต้องใช้แพลตฟอร์มที่รัน container เช่น Render (Docker), VPS หรือ Fly.io
