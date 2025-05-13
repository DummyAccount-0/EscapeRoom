import { Puzzle } from '../types';

const generatePuzzles = (): Puzzle[] => {
  const puzzles: Puzzle[] = [];

  // Level 1: Very Easy Programming Concepts
  const level1Questions = [
  {
    "question": "You awaken in a dimly lit containment cell. A digital display flickers with a sequence: `8, 3, 7, 2, 9`. To open the cell door, you need to identify the *smallest* number in this sequence.",
    "answer": ["2"],
    "hint": "Iterate through the sequence and keep track of the minimum value found so far.",
    "code": `
#include <stdio.h>
int main() {
  int code[] = {8, 3, 7, 2, 9};
  int size = sizeof(code) / sizeof(code[0]);
  int min_val = code[0];
  for (int i = 1; i < size; i++) {
    if (code[i] < min_val) {
      min_val = code[i];
    }
  }
  printf("Sub-Level Zero Unlock Digit: %d", min_val);
  printf("Keep it written, you'll require it soon. 'BIO' ");
  return 0;
}
`
    }
];

  // Level 2: Very Easy Data Types & Operations
  const level2Questions = [
  {
    question:
      "You enter a room filled with ominous warnings. A terminal displays the letters `OIB`. To proceed, you need to unscramble these letters to form the correct keyword.",
    answer: ["BIO"],
    hint: "Consider all possible arrangements of the letters.",
    code: `
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool is_permutation(const char *s1, const char *s2) {
    if (strlen(s1) != strlen(s2)) {
        return false;
    }
    int count[256] = {0};
    for (int i = 0; s1[i]; i++) {
        count[(unsigned char)s1[i]]++;
    }
    for (int i = 0; s2[i]; i++) {
        count[(unsigned char)s2[i]]--;
    }
    for (int i = 0; i < 256; i++) {
        if (count[i] != 0) {
            return false;
        }
    }
    return true;
}

int main() {
    char scrambled[] = "OIB";
    char target[] = "BIO";
    if (is_permutation(scrambled, target)) {
        printf("Access Granted! Keyword: %s\\n", target);
        printf("I love Targets: Specially when there are 5 rats.\\n");
    } else {
        printf("Access Denied. Incorrect Keyword.\\n");
    }
    return 0;
}
`
  }
];


const level3Questions = [
  {
    question:
      "You find yourself amidst strange equipment. A data log shows incomplete entries: `?, 4, ?, 6, ?`. Another display shows the numbers `1, 3, 5` which were recorded in the missing slots. You need to insert these missing numbers in increasing order to complete the sequence.",
    answer: ["1, 4, 3, 6, 5"],
    hint: "Identify the empty slots and fill them with the provided numbers in sorted order.",
    code: `
#include <stdio.h>

void sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            if (arr[i] > arr[j]) {
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
}

int main() {
    int incomplete_sequence[] = {-1, 4, -1, 6, -1}; // -1 denotes missing slots
    int missing_numbers[] = {1, 3, 5};
    int completed_sequence[5];

    // Sort the missing numbers before placing
    sort(missing_numbers, 3);
    int missing_index = 0;

    for (int i = 0; i < 5; i++) {
        if (incomplete_sequence[i] == -1) {
            completed_sequence[i] = missing_numbers[missing_index++];
        } else {
            completed_sequence[i] = incomplete_sequence[i];
        }
    }

    printf("Completed Sequence: ");
    for (int i = 0; i < 5; i++) {
        printf("%d", completed_sequence[i]);
        if (i != 4) printf(", ");
    }
    printf("\\n");
    printf("Clue Unlocked: Observe the numerical logs in the Archive.\\n");

    return 0;
}
`
  }
];


  const level4Questions = [
  {
    question:
      "Shelves upon shelves of data. A terminal asks you to identify if there are any duplicate numbers in the sequence you just found: `1, 4, 3, 6, 5`.",
    answer: ["False"],
    hint: "One way is to compare each element with every other element.",
    code: `
#include <stdio.h>
#include <stdbool.h>
bool has_duplicates(int arr[], int size) {
    for (int i = 0; i < size - 1; i++) {
        for (int j = i + 1; j < size; j++) {
            if (arr[i] == arr[j]) {
                return true;
            }
        }
    }
    return false;
}
int main() {
    int data_sequence[] = {1, 4, 3, 6, 5};
    int size = sizeof(data_sequence) / sizeof(data_sequence[0]);
    bool found = has_duplicates(data_sequence, size);
    printf("Duplicates Found: %s\\n", found ? "True" : "False");
    printf("A faint humming sound emanates from the Security Control Room access panel.\\n");
    return 0;
}
`
  }
];

const level5Questions = [
    {
      "question": "The main security panel is locked. A message reads: \"Active processes: [PID: 101, Status: RUNNING], [PID: 105, Status: BLOCKED], [PID: 101, Status: RUNNING], [PID: 112, Status: READY]\". To proceed, you need to identify the Process ID (PID) that appears most frequently.",
      "answer": ["101"],
      "hint": "Keep a count of each PID encountered.",
      "code": `
#include <stdio.h>

struct Process {
  int PID;
  char Status[20];
};

int main() {
  struct Process processes[] = {
    {101, "RUNNING"},
    {105, "BLOCKED"},
    {101, "RUNNING"},
    {112, "READY"}
  };
  int size = sizeof(processes) / sizeof(processes[0]);
  int counts[200] = {0}; // Assuming PIDs are within this range
  int most_frequent_pid = -1;
  int max_count = 0;

  for (int i = 0; i < size; i++) {
    counts[processes[i].PID]++;
    if (counts[processes[i].PID] > max_count) {
      max_count = counts[processes[i].PID];
      most_frequent_pid = processes[i].PID;
    }
  }

  printf("Most Frequent PID: %d\\n", most_frequent_pid);
  printf("A ventilation shaft nearby hisses open with the number '6' etched inside.\\n");
  return 0;
}
`
    }
  ];

  const level6Questions = [
    {
      "question": "You crawl into the ventilation system. The path ahead is blocked by a series of access panels that must be opened in a specific order: Last in, first out. The numbers pushed were: `push(15)`, `push(28)`, `push(7)`, `push(42)`. What is the unlock sequence?",
      "answer": ["42 7 28 15"],
      "hint": "Simulate a stack: the last element added is the first one removed.",
      "code": `
#include <stdio.h>
#include <stdlib.h>

#define MAX_SIZE 100

struct Stack {
  int items[MAX_SIZE];
  int top;
};

void push(struct Stack *s, int item) {
  if (s->top < MAX_SIZE - 1) {
    s->items[++s->top] = item;
  }
}

int pop(struct Stack *s) {
  if (s->top >= 0) {
    return s->items[s->top--];
  }
  return -1; // Indicate empty
}

int main() {
  struct Stack access_stack;
  access_stack.top = -1;

  push(&access_stack, 15);
  push(&access_stack, 28);
  push(&access_stack, 7);
  push(&access_stack, 42);

  printf("Ventilation System Unlock Sequence: ");
  int unlock_sequence[4];
  for (int i = 3; i >= 0; i--) {
    unlock_sequence[i] = pop(&access_stack);
    printf("%d ", unlock_sequence[i]);
  }
  printf("\\nA small keycard with the label 'MAINTENANCE' drops out after the last panel opens.\\n");
  return 0;
}
`
    }
  ];

  const level7Questions = [
    {
      "question": "You use the keycard to enter a maintenance corridor. A malfunctioning automated cleaning bot requires commands in the order they were received: `enqueue('FORWARD')`, `enqueue('LEFT')`, `enqueue('FORWARD')`, `enqueue('RIGHT')`. What is the sequence of commands to move the bot?",
      "answer": ["FORWARD LEFT FORWARD RIGHT"],
      "hint": "Simulate a queue: the first element added is the first one removed.",
      "code": `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_SIZE 100

struct Queue {
  char items[MAX_SIZE][20];
  int front;
  int rear;
};

void enqueue(struct Queue *q, const char *item) {
  if (q->rear < MAX_SIZE - 1) {
    strcpy(q->items[++q->rear], item);
  }
}

char* dequeue(struct Queue *q) {
  if (q->front <= q->rear) {
    return q->items[q->front++];
  }
  return NULL;
}

int main() {
  struct Queue command_queue;
  command_queue.front = 0;
  command_queue.rear = -1;

  enqueue(&command_queue, "FORWARD");
  enqueue(&command_queue, "LEFT");
  enqueue(&command_queue, "FORWARD");
  enqueue(&command_queue, "RIGHT");

  printf("Bot Command Sequence: ");
  char *command;
  while ((command = dequeue(&command_queue)) != NULL) {
    printf("%s ", command);
  }
  printf("\\nAt the end of the corridor, a map on the wall highlights a 'VENT' leading to the next section.\\n");
  return 0;
}
`
    }
  ];

  const level8Questions = [
    {
      "question": "You find another ventilation access point. The path is a series of tunnels: `START -> A -> B -> EXIT -> C`. To find the quickest way to the exit from 'START', what is the sequence of tunnels you must traverse?",
      "answer": ["START A B EXIT"],
      "hint": "Follow the pointers in the linked sequence from 'START' until you reach 'EXIT'.",
      "code": `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Node {
  char data[10];
  struct Node *next;
};

struct Node* createNode(const char *data) {
  struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
  strcpy(newNode->data, data);
  newNode->next = NULL;
  return newNode;
}

int main() {
  struct Node* start_node = createNode("START");
  struct Node* node_a = createNode("A");
  struct Node* node_b = createNode("B");
  struct Node* exit_node = createNode("EXIT");
  struct Node* node_c = createNode("C");

  start_node->next = node_a;
  node_a->next = node_b;
  node_b->next = exit_node;
  exit_node->next = node_c;

  printf("Ventilation Tunnel Path to Exit: ");
  struct Node* current = start_node;
  while (current != NULL) {
    printf("%s ", current->data);
    if (strcmp(current->data, "EXIT") == 0) {
      break;
    }
    current = current->next;
  }
  printf("\\nA faint signal emanates from what seems to be the 'SECURITY' area on your map.\\n");
  return 0;
}
`
    }
  ];

  const level9Questions = [
    {
      "question": "You access a secondary security terminal. To bypass the final lockdown, you need to find the 'OVERRIDE' node in a security access tree. The structure is: SYSTEM (left: AUTH, right: NETWORK), AUTH (left: USER), NETWORK (left: FIREWALL, right: OVERRIDE). Does the 'OVERRIDE' node exist in this system?",
      "answer": ["True"],
      "hint": "Perform a tree traversal (like a recursive search) starting from the root to see if 'OVERRIDE' can be found.",
      "code": `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

struct TreeNode {
  char data[10];
  struct TreeNode *left;
  struct TreeNode *right;
};

struct TreeNode* createTreeNode(const char *data) {
  struct TreeNode* newNode = (struct TreeNode*)malloc(sizeof(struct TreeNode));
  strcpy(newNode->data, data);
  newNode->left = NULL;
  newNode->right = NULL;
  return newNode;
}

bool findNode(struct TreeNode* root, const char *target) {
  if (root == NULL) {
    return false;
  }
  if (strcmp(root->data, target) == 0) {
    return true;
  }
  return findNode(root->left, target) || findNode(root->right, target);
}

int main() {
  struct TreeNode* root = createTreeNode("SYSTEM");
  root->left = createTreeNode("AUTH");
  root->right = createTreeNode("NETWORK");
  root->left->left = createTreeNode("USER");
  root->right->left = createTreeNode("FIREWALL");
  root->right->right = createTreeNode("OVERRIDE");

  bool found = findNode(root, "OVERRIDE");
  printf("Override Found: %s\\n", found ? "True" : "False");
  printf("A hidden passage opens, leading towards the 'EMERGENCY' area.\\n");
  return 0;
}
`
    }
  ];

  const level10Questions = [
    {
      "question": "You reach the emergency exit hallway. A diagram shows junctions and pathways: S->A, S->B, A->C, B->D, C->E, D->E. What is the sequence of junctions in the shortest path from 'S' to 'E' in terms of the number of steps?",
      "answer": ["S A C E", "S B D E"],
      "hint": "Perform a Breadth-First Search (BFS) starting from 'S' to find the shortest path in terms of the number of edges.",
      "code": `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define MAX_NODES 10

struct QueueNode {
  char node[2];
  char path[MAX_NODES * 2]; // Assuming max path length
  struct QueueNode *next;
};

struct Queue {
  struct QueueNode *front;
  struct QueueNode *rear;
};

void enqueue(struct Queue *q, const char *node, const char *path) {
  struct QueueNode *newNode = (struct QueueNode*)malloc(sizeof(struct QueueNode));
  strcpy(newNode->node, node);
  strcpy(newNode->path, path);
  newNode->next= NULL;
  if (q->rear == NULL) {
    q->front = q->rear = newNode;
    return;
  }
  q->rear->next = newNode;
  q->rear = newNode;
}

struct QueueNode* dequeue(struct Queue *q) {
  if (q->front == NULL) {
    return NULL;
  }
  struct QueueNode *temp = q->front;
  q->front = q->front->next;
  if (q->front == NULL) {
    q->rear = NULL;
  }
  return temp;
}

int main() {
  // Adjacency list representation
  char* adj[MAX_NODES][MAX_NODES] = {
    {"A", "B", NULL},       // S (index 0)
    {"S", "C", NULL},       // A (index 1)
    {"S", "D", NULL},       // B (index 2)
    {"A", "E", NULL},       // C (index 3)
    {"B", "E", NULL},       // D (index 4)
    {"C", "D", NULL},       // E (index 5)
  };
  char nodes[] = {'S', 'A', 'B', 'C', 'D', 'E'};
  int start_node_index = 0;
  int end_node_index = 5;

  struct Queue q;
  q.front = q.rear = NULL;

  char start_node[2] = {nodes[start_node_index], '\\0'};
  enqueue(&q, start_node, start_node);
  bool visited[MAX_NODES] = {false};
  visited[start_node_index] = true;

  printf("Shortest Path to Emergency Exit: ");

  while (q.front != NULL) {
    struct QueueNode* current = dequeue(&q);
    int current_index;
    for (int i = 0; i < MAX_NODES; i++) {
      if (current->node[0] == nodes[i]) {
        current_index = i;
        break;
      }
    }

    if (current_index == end_node_index) {
      printf("%s\\n", current->path);
      break; // Found the shortest path (in terms of steps for unweighted graph)
    }

    for (int i = 0; adj[current_index][i] != NULL; i++) {
      char neighbor_node[2] = {adj[current_index][i][0], '\\0'};
      int neighbor_index;
      for (int j = 0; j < MAX_NODES; j++) {
        if (neighbor_node[0] == nodes[j]) {
          neighbor_index = j;
          break;
        }
      }

      if (!visited[neighbor_index]) {
        visited[neighbor_index] = true;
        char new_path[MAX_NODES * 2];
        strcpy(new_path, current->path);
        strcat(new_path, " ");
        strcat(new_path, neighbor_node);
        enqueue(&q, neighbor_node, new_path);
      }
    }
    free(current);
  }
  printf("The final door unlocks! You've found a potential escape route.\\n");
  return 0;
}
`
    }
  ];

// Add level 1 puzzles
level1Questions.forEach((q, i) =>
  puzzles.push({
    id: 1000 + i,
    level: 1,
    type: 'code',
    question: q.question,
    answer: q.answer,
    hint: q.hint,
    code: q.code
  })
);

// Add level 2 puzzles
level2Questions.forEach((q, i) =>
  puzzles.push({
    id: 2000 + i,
    level: 2,
    type: 'code',
    question: q.question,
    answer: q.answer,
    hint: q.hint,
    code: q.code
  })
);

// Add level 3 puzzles
level3Questions.forEach((q, i) =>
  puzzles.push({
    id: 3000 + i,
    level: 3,
    type: 'code',
    question: q.question,
    answer: q.answer,
    hint: q.hint,
    code: q.code
  })
);

// Add level 4 puzzles
level4Questions.forEach((q, i) =>
  puzzles.push({
    id: 4000 + i,
    level: 4,
    type: 'code',
    question: q.question,
    answer: q.answer,
    hint: q.hint,
    code: q.code
  })
);

level5Questions.forEach((q, i) =>
  puzzles.push({
    id: 5000 + i,
    level: 5,
    type: 'code',
    question: q.question,
    answer: q.answer,
    hint: q.hint,
    code: q.code
  })
);

level6Questions.forEach((q, i) =>
  puzzles.push({
    id: 6000 + i,
    level: 6,
    type: 'code',
    question: q.question,
    answer: q.answer,
    hint: q.hint,
    code: q.code
  })
);

level7Questions.forEach((q, i) =>
  puzzles.push({
    id: 7000 + i,
    level: 7,
    type: 'code',
    question: q.question,
    answer: q.answer,
    hint: q.hint,
    code: q.code
  })
);

level8Questions.forEach((q, i) =>
  puzzles.push({
    id: 8000 + i,
    level: 8,
    type: 'code',
    question: q.question,
    answer: q.answer,
    hint: q.hint,
    code: q.code
  })
);

level4Questions.forEach((q, i) =>
  puzzles.push({
    id: 9000 + i,
    level: 9,
    type: 'code',
    question: q.question,
    answer: q.answer,
    hint: q.hint,
    code: q.code
  })
);

level10Questions.forEach((q, i) =>
  puzzles.push({
    id: 10000 + i,
    level: 10,
    type: 'code',
    question: q.question,
    answer: q.answer,
    hint: q.hint,
    code: q.code
  })
);

  return puzzles;
};

export const allPuzzles = generatePuzzles();

export const getPuzzlesByLevel = (level: number): Puzzle[] => {
  return allPuzzles.filter(puzzle => puzzle.level === level);
};

export const getRandomPuzzle = (level: number): Puzzle => {
  const levelPuzzles = getPuzzlesByLevel(level);
  const randomIndex = Math.floor(Math.random() * levelPuzzles.length);
  return levelPuzzles[randomIndex];
};
