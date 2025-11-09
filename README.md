Real-Time High-Performance Dashboard (Next.js 14 + React + Canvas)

A fully custom real-time dashboard built with **Next.js 14**, **TypeScript**, **React Client Components**, and **HTML5 Canvas** — without using any chart libraries.

Supports **10,000+ live-updating data points**, rendered at **60 FPS**, powered by a **Web Worker** and optimized canvas drawing.

This project showcases **advanced frontend engineering**, **high-performance rendering**, **React optimization**, and **Next.js App Router architecture**.

---

## Features

### Real-Time Data Visualizations
- **Line Chart**
 <img width="772" height="336" alt="image" src="https://github.com/user-attachments/assets/41705960-0dc1-44ed-a4be-9f7a0a384085" />

- **Bar Chart**
  <img width="745" height="323" alt="image" src="https://github.com/user-attachments/assets/c9d8d9f2-8d4b-497a-8c76-0e7b66b8ba81" />

- **Scatter Plot**
 <img width="785" height="350" alt="image" src="https://github.com/user-attachments/assets/d9b36afd-c695-48f1-8699-99b22b74a5fc" />

- **Heatmap**
 <img width="1128" height="633" alt="image" src="https://github.com/user-attachments/assets/f3e19a9a-946e-4de3-9c91-e8447c6b6d10" />

- **Combined Grid View**
<img width="245" height="235" alt="image" src="https://github.com/user-attachments/assets/ce1342af-d855-4946-92e1-7d34ce9de1b3" />

- **Focused view for each chart**
  <img width="1429" height="798" alt="image" src="https://github.com/user-attachments/assets/1d99c324-3bc6-4b2a-9943-8c02302bc989" />

- 
  <img width="1600" height="838" alt="image" src="https://github.com/user-attachments/assets/3feffea6-702c-4627-962b-38e33f6d8eb4" />

- **Alter Data Rate and watch the visualation live**
 <img width="245" height="96" alt="image" src="https://github.com/user-attachments/assets/900971e8-5719-4013-8c8c-8a2f33d34907" />



All charts include:
- Smooth real-time streaming (100ms interval)
- Canvas-based rendering
- Axes with labels
- High-performance drawing pipeline

---

## Performance Engine

### Web Worker Data Stream (10k+ points)
- Generates synthetic time-series data
- Posts updates without blocking UI thread
- Maintains fixed-size circular buffer

### Canvas Rendering Optimizations
- `requestAnimationFrame` render loop
- `useMemo` and `React.memo` to reduce renders
- Batched drawing operations
- Per-chart render functions
- GPU-accelerated canvas

### Smart Memory Management
- Fixed-size buffers avoid memory leaks
- Bounded window of data
- Efficient typed arrays

---

##  Built-In Performance Monitor

The dashboard ships with a live **Performance Panel** showing:

| Metric | Description |
|--------|-------------|
| **FPS** | True frames per second (accurate 1-second window) |
| **CPU Usage %** | Estimated main-thread usage per frame |
| **JS Heap Memory** | Chrome-supported memory tracking |
| **Latency** | Simulated network/processing latency |

---

## Tech Stack

- **Next.js 14 App Router**
- **React 18 Client Components**
- **TypeScript**
- **Canvas 2D API**
- **Web Workers**
- **TailwindCSS**

Setup:
Run : Fork this repo and 
run
1. npm install
2. "npm run dev"
   in the terminal.
---
Open: http://localhost:3000/dashboard 
