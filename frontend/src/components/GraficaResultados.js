import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const GraficaResultados = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/resultados_grafica/')
      .then(res => setData(res.data))
      .catch(err => console.error('Error al cargar los datos:', err));
  }, []);

  return (
    <div style={{ width: '100%', height: '500px', padding: '20px' }}>
      <h2>Comparación de Resultados Pre y Post-Test</h2>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Pre-Test" fill="#8884d8" />
            <Bar dataKey="Post-Test" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No hay datos disponibles aún.</p>
      )}
    </div>
  );
};

export default GraficaResultados;
