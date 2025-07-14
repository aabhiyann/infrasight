import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import numpy as np
from sklearn.decomposition import PCA
from utils.file_loader import load_mock_cost_data
from ml_utils import cluster_costs

def plot_clusters():
    # step 1: load and cluster the data
    raw_data = load_mock_cost_data()
    result = cluster_costs(raw_data)
    vectors = result['service_vectors'] # Dict[service][date] = amount

    # step 2: convert to dataframe
    df = pd.DataFrame(vectors)

    # step 3: apply PCA to reduce from n-dimensions to 2D
    pca = PCA(n_components=2)
    reduced = pca.fit_transform(df)

    # step 4: plot the clusters with colors
    labels = {}
    for cluster, services in result["clusters"].items():
        for svc in services:
            labels[svc] = cluster

    # Dynamically generate colors for any number of clusters
    num_clusters = len(result["clusters"])
    if num_clusters <= 10:
        # Use a qualitative colormap for small number of clusters
        colors = plt.cm.Set3(np.linspace(0, 1, num_clusters))
    else:
        # Use a continuous colormap for large number of clusters
        colors = plt.cm.viridis(np.linspace(0, 1, num_clusters))
    
    # Create color mapping
    cluster_colors = {}
    for i, cluster_name in enumerate(result["clusters"].keys()):
        cluster_colors[cluster_name] = colors[i]

    # Plot each service
    for i, svc in enumerate(df.index):
        cluster = labels.get(svc, "Unknown")
        color = cluster_colors.get(cluster, "gray")
        plt.scatter(reduced[i, 0], reduced[i, 1], color=color, label=cluster)
        plt.text(reduced[i, 0], reduced[i, 1], svc, fontsize=8)

    plt.title(f"AWS Service Clusters (via KMeans + PCA) - {num_clusters} Clusters")
    plt.xlabel("Component 1")
    plt.ylabel("Component 2")
    
    # Create legend with unique cluster names
    unique_clusters = list(set(labels.values()))
    handles = []
    for cluster in unique_clusters:
        if cluster in cluster_colors:
            handles.append(plt.Line2D([0], [0], marker='o', color='w', 
                                     label=cluster, markerfacecolor=cluster_colors[cluster], 
                                     markersize=10))
    
    plt.legend(handles=handles, loc='best', bbox_to_anchor=(1.05, 1))
    plt.grid(True)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    plot_clusters()

