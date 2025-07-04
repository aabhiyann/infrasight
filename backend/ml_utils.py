import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from datetime import datetime
from typing import List, Dict

# Step 1: Format raw cost data into a Pandas DataFrame
def preprocess_cost_data(raw_data: Dict) -> pd.DataFrame:
    records = []

    #  Flatten the nested AWS cost format into rows
    