from langgraph.graph import END, START, StateGraph

from .nodes.class_info import class_info_node
from .nodes.course_info import course_info_node
from .nodes.enrollments import enrollments_node
from .nodes.extract_task import extract_task_node, route_extracted_task
from .nodes.general import general_node
from .nodes.planner import planner_node
from .nodes.response import response_node
from .nodes.search_course import search_course_node
from .nodes.upcoming_classes import upcoming_classes_node
from .state import AdvisorState
from .types import AdvisorNodes


graph = StateGraph(AdvisorState)

graph.add_node(AdvisorNodes.PLANNER_NODE, planner_node)
graph.add_node(AdvisorNodes.EXTRACT_TASK_NODE, extract_task_node)
graph.add_node(AdvisorNodes.RESPONSE_NODE, response_node)
graph.add_node(AdvisorNodes.GENERAL_NODE, general_node)
graph.add_node(AdvisorNodes.SEARCH_COURSE_NODE, search_course_node)
graph.add_node(AdvisorNodes.COURSE_INFO_NODE, course_info_node)
graph.add_node(AdvisorNodes.CLASS_INFO_NODE, class_info_node)
graph.add_node(AdvisorNodes.UPCOMING_CLASSES_NODE, upcoming_classes_node)
graph.add_node(AdvisorNodes.ENROLLMENTS_NODE, enrollments_node)

graph.add_edge(START, AdvisorNodes.PLANNER_NODE)
graph.add_edge(AdvisorNodes.PLANNER_NODE, AdvisorNodes.EXTRACT_TASK_NODE)
graph.add_conditional_edges(
    AdvisorNodes.EXTRACT_TASK_NODE,
    route_extracted_task,
    {
        AdvisorNodes.RESPONSE_NODE: AdvisorNodes.RESPONSE_NODE,
        AdvisorNodes.GENERAL_NODE: AdvisorNodes.GENERAL_NODE,
        AdvisorNodes.SEARCH_COURSE_NODE: AdvisorNodes.SEARCH_COURSE_NODE,
        AdvisorNodes.COURSE_INFO_NODE: AdvisorNodes.COURSE_INFO_NODE,
        AdvisorNodes.CLASS_INFO_NODE: AdvisorNodes.CLASS_INFO_NODE,
        AdvisorNodes.UPCOMING_CLASSES_NODE: AdvisorNodes.UPCOMING_CLASSES_NODE,
        AdvisorNodes.ENROLLMENTS_NODE: AdvisorNodes.ENROLLMENTS_NODE,
    },
)

for node in [
    AdvisorNodes.GENERAL_NODE,
    AdvisorNodes.SEARCH_COURSE_NODE,
    AdvisorNodes.COURSE_INFO_NODE,
    AdvisorNodes.CLASS_INFO_NODE,
    AdvisorNodes.UPCOMING_CLASSES_NODE,
    AdvisorNodes.ENROLLMENTS_NODE,
]:
    graph.add_edge(node, AdvisorNodes.EXTRACT_TASK_NODE)

graph.add_edge(AdvisorNodes.RESPONSE_NODE, END)

app_graph = graph.compile()
