import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Overview } from "./components/dashboard/Overview";
import { Transactions } from "./components/dashboard/Transactions";
import { InsightCards } from "./components/dashboard/Insights";
import { Invoices } from "./components/dashboard/Invoices";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/insights" element={<InsightCards />} />
          <Route path="/invoices" element={<Invoices />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;