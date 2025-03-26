import pandas as pd 
import plotly.graph_objects as go
import plotly.figure_factory as ff

import plotly.express as px

df = pd.read_csv("Cleaned_Panic_Dataset.csv")

#heatmap data
causes = ["Caffeine_Intake", "Exercise_Frequency", "Sleep_Hours", "Alcohol_Consumption", "Smoking", "Therapy"]
correlations = df[causes].corrwith(df["Panic_Score"])

fig = go.Figure(data=go.Heatmap(
    z=correlations.values.reshape(1, -1),  # Reshape to a single row
    x=correlations.index,  # Causes as columns
    y=["Panic_Score"],  # Panic_Score as the single row
    colorscale="Viridis",  # Choose a color scale
    colorbar=dict(title="Correlation")  # Add a colorbar title
))

# Add title and labels
fig.update_layout(
    title='Heatmap of Panic Attack Dataset',
    xaxis_title='Effects',
    yaxis_title='Causes'
)

fig.show()


# Correlation Matrix
column = ["Panic_Attack_Frequency", "Duration_Minutes", "Panic_Score", "Heart_Rate", "Sweating", "Shortness_of_Breath", "Dizziness", "Caffeine_Intake", "Exercise_Frequency", "Sleep_Hours", "Alcohol_Consumption", "Smoking", "Therapy"]
correlation_matrix = df[column].corr()

fig = px.imshow(
    correlation_matrix,
    text_auto=True,  
    color_continuous_scale="Viridis",  
    title="Correlation Matrix of Panic Attack Dataset"
)

fig.show()

# columns= ["Panic_Attack_Frequency", "Duration_Minutes", "Panic_Score", "Heart_Rate", "Sweating", "Shortness_of_Breath", "Dizziness"]
# values = ["Caffeine_Intake", "Exercise_Frequency", "Sleep_Hours", "Alcohol_Consumption", "Smoking", "Therapy"]