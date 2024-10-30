import React, { useState } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useStore } from './store';
import { Grid } from './components/Grid';
import { PanelSelector } from './components/PanelSelector';
import { StringCreator } from './components/StringCreator';
import { StringCalculator } from './components/StringCalculator';
import { PlacedComponents } from './components/PlacedComponents';
import { ContextMenu } from './components/ContextMenu';
import { MPPTManager } from './components/MPPTManager';
import { Panel } from './components/Panel';
import { Navbar } from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Designer } from './pages/Designer';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/designer" element={<Designer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}