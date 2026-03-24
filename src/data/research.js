const researchDomains = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    color: '#e040fb',
    position: [0, 3, 0],
    papers: [
      {
        id: 'paper-1',
        title: 'Attention Mechanisms in Transformer Architectures',
        year: 2024,
        summary: 'Explored novel sparse attention patterns that reduce computational complexity from O(n²) to O(n√n) while maintaining performance parity.',
        keyConcepts: ['Transformers', 'Sparse Attention', 'Efficiency'],
        notes: 'Presented at NeurIPS 2024 workshop. Received best paper honorable mention.',
        link: '#',
        position: [1, 1, 0],
      },
      {
        id: 'paper-2',
        title: 'Federated Learning for Edge Devices',
        year: 2023,
        summary: 'Proposed a communication-efficient federated learning framework optimized for resource-constrained IoT devices.',
        keyConcepts: ['Federated Learning', 'Edge Computing', 'Privacy'],
        notes: 'Published in IEEE IoT Journal. 15+ citations.',
        link: '#',
        position: [-1, 2, 1],
      },
    ],
  },
  {
    id: 'space',
    name: 'Space Technology',
    color: '#4fc3f7',
    position: [6, -2, 2],
    papers: [
      {
        id: 'paper-3',
        title: 'Orbital Debris Tracking with ML',
        year: 2024,
        summary: 'Developed a machine learning pipeline for real-time tracking and trajectory prediction of orbital debris using radar data.',
        keyConcepts: ['Space Debris', 'Object Detection', 'Trajectory Prediction'],
        notes: 'Collaboration with NASA JPL. Used in operational prototype.',
        link: '#',
        position: [2, 0, -1],
      },
    ],
  },
  {
    id: 'data-science',
    name: 'Data Science',
    color: '#00e676',
    position: [-5, -1, -2],
    papers: [
      {
        id: 'paper-4',
        title: 'Causal Inference in Observational Health Data',
        year: 2023,
        summary: 'Applied double machine learning methods to extract causal treatment effects from large-scale electronic health records.',
        keyConcepts: ['Causal Inference', 'Health Analytics', 'DML'],
        notes: 'Published in Journal of Biomedical Informatics.',
        link: '#',
        position: [-2, -1, 0],
      },
      {
        id: 'paper-5',
        title: 'Graph Neural Networks for Social Network Analysis',
        year: 2024,
        summary: 'Novel GNN architecture for community detection in dynamic social networks with temporal edge features.',
        keyConcepts: ['GNNs', 'Social Networks', 'Community Detection'],
        notes: 'Under review at KDD 2025.',
        link: '#',
        position: [0, -2, 2],
      },
    ],
  },
]

export default researchDomains
