#make a sankey diagram with the causes conecting to the effects and weighted by count

import plotly.graph_objects as go
import pandas as pd
import plotly.colors as pc

items = pd.read_csv("Cleaned_Panic_Dataset.csv")

def code_mapping(df, src, targ):
    src_list = [str(x) for x in df[src]]
    targ_list = [str(x) for x in df[targ]]
    
    labels = sorted(list(set(src_list + targ_list)))

    codes = list(range(len(labels)))

    lc_map = dict(zip(labels, codes))

    src_map = {val: lc_map[str(val)] for val in df[src].unique()}
    targ_map = {val: lc_map[str(val)] for val in df[targ].unique()}
    
    df_copy = df.copy()
    df_copy[src] = df[src].map(src_map)
    df_copy[targ] = df[targ].map(targ_map)
    
    return df_copy, labels

def make_sankey(df, src, targ, vals=None, **kwargs):
    """ Generate a sankey diagram
    df - Dataframe
    src - Source column
    targ - Target column
    vals - Values column (optional)
    optional params: pad, thickness, line_color, line_width """

    if vals:
        values = df[vals] * 2
    else:
        values = [1] * len(df[src]) 
    colorscale = pc.sequential.Viridis  
    
    df, labels = code_mapping(df, src, targ)
    label_colors = {}
    for i, label_name in enumerate(labels):
        label_colors[i] = colorscale[i % len(colorscale)]
    link = {'source': df[src], 'target': df[targ], 'value': values,'color': [label_colors[s] for s in df[src]]}

    pad = kwargs.get('pad', 100)
    thickness = kwargs.get('thickness', 100)
    line_color = kwargs.get('line_color')
    line_width = kwargs.get('line_width', 1)

    node = {'label': labels, 'pad': pad, 'thickness': thickness, 'line': {'color': line_color, 'width': line_width}}
    sk = go.Sankey(link=link, node=node)
    fig = go.Figure(sk)

    width = kwargs.get('width', 1500)
    height = kwargs.get('height', 1000)
    fig.update_layout(
        autosize=False,
        width=width,
        height=height,
        title="Relationship Between Causes and Panic Severity",
        annotations=[

            dict(
                x=0.01,
                y=1.05,
                xref="paper",
                yref="paper",
                text="Cause",
                showarrow=False,
                font=dict(size=16)
            ),

            dict(
                x=0.99,
                y=1.05,
                xref="paper",
                yref="paper",
                text="Severity Score",
                showarrow=False,
                font=dict(size=16)
            )
        ]
    )

    return fig

def show_sankey(df, src, targ, vals=None, **kwargs):
    fig = make_sankey(df, src, targ, vals, **kwargs)
    fig.show()

def main():
    src = "Panic_Severity"
    targ = "Trigger"
    
    trigger_counts = items[src].value_counts().to_dict()
    
    items['trigger_count'] = items[src].map(trigger_counts)
    
    vals = 'trigger_count'
    fig = make_sankey(items, src, targ, vals)

    fig.show()

if __name__ == "__main__":
    main()