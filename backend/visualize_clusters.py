import pandas as pd
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from utils.file_loader import load_mock_cost_data
from ml_utils import cluster_costs

def plot_clusters():
    # step 1: load and cluster the data
    raw_data = load_mock_cost_data()
    result = cluster_costs(raw_data)
    vectors = result['service_vectors'] # Dict[service][date] = amount

    # step 2: comvert to dataframe
    df = pd.DataFrame(vectors)

    # step 3: apply PCA to reduce from n-dimensions to 2D
    pca = PCA(n_components=2)
    reduced = pca.fit_transform(df)

    # step 4: plot the clusters with colors
    labels = {}
    for cluster, services in result["clusters"].items():
        for svc in services:
            labels[svc] = cluster

    colors = {"Cluster 0": "red", "Cluster 1": "blue", "Cluster 2": "green", "Cluster 3": "yellow", "Cluster 4": "purple"}
    for i, svc in enumerate(df.index):
        cluster = labels.get(svc, "Unknown")
        plt.scatter(reduced[i, 0], reduced[i, 1], color=colors.get(cluster, "gray"), label=cluster)
        plt.text(reduced[i, 0], reduced[i, 1], svc, fontsize=8)

    plt.title("AWS Service Clusters (via KMeans + PCA)")
    plt.xlabel("Component 1")
    plt.ylabel("Component 2")
    handles = [plt.Line2D([0], [0], marker='o', color='w', label=c, markerfacecolor=clr, markersize=10)
               for c, clr in colors.items()]
    plt.legend(handles=handles)
    plt.grid(True)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    plot_clusters()

