# btrack: Bayesian Tracking Visualization

An interactive web application designed to demonstrate the mathematical principles behind **btrack**, a Python library for reconstructing trajectories in complex dynamic systems using Bayesian inference and global optimization.

## Run the Application

You can run and edit this application directly in Google AI Studio:

[![Run on Google AI Studio](https://img.shields.io/badge/Run%20on-Google%20AI%20Studio-4285F4?style=for-the-badge&logo=google)](https://aistudio.google.com/)

## Overview

This application serves as a visual aid for explaining the differences between greedy (nearest-neighbor) tracking and advanced Bayesian methods. It visualizes concepts such as:

*   **Kalman Filtering**: State space prediction vs. naive detection.
*   **Adaptive Gating**: Mahalanobis distance vs. Euclidean search radius.
*   **Hypothesis Generation**: Constructing tracks with biological constraints (Mitosis, Apoptosis).
*   **Global Optimization**: Solving the tracking problem using Integer Linear Programming (ILP).

## Tech Stack

*   **Core**: React 18
*   **3D Visualization**: Three.js, @react-three/fiber, @react-three/drei
*   **2D Simulations**: HTML5 Canvas, SVG
*   **Animations**: Framer Motion
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React

## Key Components

*   `QuantumScene.tsx`: Handles 3D visualizations (Hero background, Graph network).
*   `Diagrams.tsx`: Contains interactive 2D widgets:
    *   `TrackingSimulation`: Compares Greedy vs. Bayesian motion models.
    *   `CrossingVisual`: Demonstrates solutions to ID switching during occlusions.
    *   `GatingVisual`: Visualizes probabilistic search regions.
    *   `HypothesisTree`: Graph theory visualization for track linking.
    *   `BenchmarkChart`: Performance comparison metrics.

## Resources

*   `presentation_script.md`: A 10-minute presentation script (in Czech) guiding through the visualization narrative, suitable for academic or technical audiences.

## Credits

Based on the research and open-source software by the **Lowe Lab** at University College London (UCL) and The Alan Turing Institute.

*   **Library**: [btrack on GitHub](https://github.com/quantumjot/btrack)
*   **Paper**: *Nature Communications (2020)*
