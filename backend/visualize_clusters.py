import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import numpy as np
from sklearn.decomposition import PCA
from utils.file_loader import load_mock_cost_data
from ml_utils import cluster_costs

def plot_clusters():
    # Load data
    raw_data = load_mock_cost_data()
    result = cluster_costs(raw_data)
    vectors = result['service_vectors']

    # Convert to DataFrame: services = rows, dates = columns
    df = pd.DataFrame(vectors)

    # PCA: reduce to 2D for plotting
    pca = PCA(n_components=2)
    reduced = pca.fit_transform(df)

    # Map service -> cluster
    labels = {}
    for cluster, services in result["clusters"].items():
        for svc in services:
            labels[svc] = cluster

    # Assign dynamic colors
    num_clusters = len(result["clusters"])
    if num_clusters <= 10:
        colors = plt.cm.Set3(np.linspace(0, 1, num_clusters))
    elif num_clusters <= 20:
        colors = plt.cm.tab20(np.linspace(0, 1, num_clusters))
    else:
        colors = plt.cm.nipy_spectral(np.linspace(0, 1, num_clusters))
        print(f"[Warning] High number of clusters ({num_clusters}). Colors and legend may be hard to distinguish.")

    cluster_colors = {
        cluster_name: colors[i]
        for i, cluster_name in enumerate(result["clusters"].keys())
    }

    # Precompute total cost for marker size
    total_cost = df.sum(axis=1)

    # Marker shapes to cycle through (will repeat if too few)
    markers = ['o', 's', '^', 'D', 'P', 'X', '*', 'v', '<', '>']
    
    # Plot
    plt.figure(figsize=(10, 6))
    for i, svc in enumerate(df.index):
        cluster = labels.get(svc, "Unknown")
        color = cluster_colors.get(cluster, "gray")
        marker = markers[hash(cluster) % len(markers)]
        # Reduce marker size for high cluster counts
        if num_clusters > 30:
            size = total_cost[svc] * 15  # Smaller for less overlap
        else:
            size = total_cost[svc] * 50

        plt.scatter(
            reduced[i, 0], reduced[i, 1],
            color=color,
            s=size,
            marker=marker,
            edgecolors='black',
            label=cluster if i == 0 else "",
            alpha=0.8
        )
        plt.text(
            reduced[i, 0] + 0.02, reduced[i, 1] + 0.02,
            svc,
            fontsize=9,
            alpha=0.7
        )

    plt.title(f"AWS Service Clusters (via KMeans + PCA) - {num_clusters} Clusters")
    plt.xlabel("Component 1")
    plt.ylabel("Component 2")
    plt.grid(True)

    # Unique legend
    handles = []
    if num_clusters <= 30:
        for cluster in list(result["clusters"].keys())[:30]:
            color = cluster_colors.get(cluster, "gray")
            marker = markers[hash(cluster) % len(markers)]
            handles.append(
                plt.Line2D([0], [0], marker=marker, color='w',
                           label=cluster, markerfacecolor=color,
                           markeredgecolor='black', markersize=10)
            )
        plt.legend(handles=handles, loc='best', bbox_to_anchor=(1.05, 1))
    else:
        print("[Info] Legend skipped due to high cluster count.")
    plt.tight_layout()
    
    # Save the plot
    plt.savefig("cluster_plot.png", dpi=300)
    plt.show()

if __name__ == "__main__":
    plot_clusters()
