
export class Tree {
  protected Map: NodeMap = {};
  public get Nodes(): NodeMap {
    return this.Map;
  }

  protected Core: Array<INodeRecord> = [];
  
  public get DBRecord(): Array<INodeRecord> {
    
    if (Object.keys(this.Map).length > 0) {
      console.log(this.MapToCore());
      return this.MapToCore();
      
    } else {
      return this.Core;
    }
  }

  public Roots: Array<string> = [];


  

  constructor(nodes: Array<INodeRecord>) {
    this.Core = nodes;
    console.log(this.Core);
    this.addNodes(nodes);
    this.Roots = this.getRoots();

  }
  
  public addNodes(nodes: Array<INodeRecord>, map = this.Map, resetCore: boolean = false) {

    if (resetCore == true) {
      this.Core = [];
    }

    nodes.forEach((node: INodeRecord, index: number) => {
      
        this.addNode(node, index, map);
      

    });
  }
  public getRoots(map: NodeMap = this.Map): Array<string> {
    let roots: Array<string> = [];
    for (var iD in map) {
      if (map[iD].record.Depth === 0) {
        roots.push(iD);
      }
    }
    return roots;
  }
  
  protected addNode(node: INodeRecord, index: number, map = this.Map) {
    map[node.Id] = new Node(node, index);
    if (!node.Parent) {

      this.Roots.push(node.Id);
    } else if(!map[node.Parent].hasChild(node.Id)){
      map[node.Parent].record.Nodes.push(node.Id);
      
    }
    this.logErrors(node.Id);
  }

  public newNode(parentId: string = null): boolean {
    if (parentId && this.Map[parentId] && this.Map[parentId].ui.delete) {
      return false;
    }
    const nR: NodeRecord = this.generateNode(parentId);
    
    this.Core.push(nR);
    this.addNode(nR, this.Core.length - 1);
   
    return true;
  }

  public updateMapIndices(core: Array<INodeRecord> = this.Core, map: NodeMap = this.Map) {
    core.forEach((rec: INodeRecord, index: number) => {
      if (!map[rec.Id]) {
        this.addNode(rec, index, map);
      } else {
        map[rec.Id].ui.index = index;
      }

    });
  }
  public cleanMap() {
    this._cleanMap();
  }
  protected _cleanMap(core: Array<INodeRecord> = this.Core, map: NodeMap = this.Map, roots: Array<string> = this.Roots) {
    
    for (let i: number = core.length - 1; i >= 0; i--) {
      this.logErrors(core[i].Id);
      if (this.shouldDelete(core[i].Id)) {
        
        this.deleteNode(core[i], i);
      }
    }
    for (let i = roots.length - 1; i >= 0; i--) {
      if (!this.Map[roots[i]]) {
        roots.splice(i, 1);
      }
    }
    this.updateMapIndices();
  }
  public logErrors(id: string) {
    this.errorName(id);

  }

  protected deleteNode(record: INodeRecord, index: number) {
    
    this.Core.splice(index, 1);
    if (this.Map[record.Parent]) this.Map[record.Parent].deleteChild(record.Id);
    if (this.Map[record.Id]) {
      delete this.Map[record.Id];
    }

  }
  public signDeleteNode(Id: string, really: boolean = true) {
    if (this.Map[Id]) return;
    this.Map[Id].ui.delete = this.Map[Id].record.Nodes.length == 0 && really;
  }
  public signToggleDeleteNode(Id: string) {
    
    if (!this.Map[Id]) return;
    
    console.log('id');
    this.Map[Id].ui.delete = this.Map[Id].record.Nodes.length == 0 && !(this.Map[Id].ui.delete);
    console.log(this.Map[Id].ui.delete);
  }


  public shouldDelete(Id: string, map: NodeMap = this.Map): boolean {
    console.log("deleting", map[Id]);
    console.log(map[Id].hasError || map[Id].ui.delete);
    console.log(!map[Id].hasChildren);
    return (map[Id]) && (map[Id].hasError  || map[Id].ui.delete ) && !map[Id].hasChildren;
  }


  public errorName(id: string) {
   
    if (!this.Map[id])
      return;

    if (this.Map[id].record.Name.length == 0) {
      this.Map[id].setError('Name', true);
      return;
    }

    if (!this.Map[id].record.Parent)
      return;

    let parent: Node = this.Map[this.Map[id].record.Parent];
    if (!parent)
      return;

    for (let i = 0; i < parent.record.Nodes.length; i++) {
      if (this.Map[parent.record.Nodes[i]] && this.Map[id].record.Name === this.Map[parent.record.Nodes[i]].record.Name && id != this.Map[parent.record.Nodes[i]].record.Id) {
        this.Map[id].setError('Name', true);
        return;

      }
    }


  }
  public redactErrorName(id: string) {
    if (this.Map[id]) {
      this.Map[id].setError('Name');
    }

  }


  protected generateNode(parentId: string = null): NodeRecord {
    return Object.assign(new NodeRecord(), {
      Id: parentId ? `${this.Map[parentId].record.Id},${this.Map[parentId].record.Nodes? this.Map[parentId].record.Nodes.length: 0}` : `${this.Roots.length}`,
      Name: parentId ? `Child_${this.Map[parentId].record.Nodes.length}` : `Root_${this.Roots.length}`,
      Parent: parentId,
      Depth: parentId ? this.Map[parentId].record.Depth + 1 : 0

    });

  }

  public MapToCore(): Array<INodeRecord> {
    this.Core = this.MapToRecords();
    return this.Core;
    
  }
  protected MapToRecords(core: Array<INodeRecord> = this.Core, map: NodeMap = this.Map, roots: Array<string> = this.Roots): Array<INodeRecord> {
    let ourIds = {};
    this._cleanMap(core, map, roots);
    let newcore: Array<INodeRecord> = Object.values(map).filter((node: Node) => {
      return !node.hasError && !ourIds[node.record.Id];
    }).map((node: Node) => {
      ourIds[node.record.Id] = true;
      return node.record
      });
    console.log("records", newcore);
    return newcore;
  }


  protected RecordsToMap(records: Array<INodeRecord>, map:NodeMap = this.Map): NodeMap {
    
    this.addNodes(records, map);
    return map;
  }


  public Filter(Name: string = "", Depth: number = -1) {
    //console.log("bingo");
    for (var iD in this.Map) {

      (this.Map[iD].record.Name === Name) && this.Map[iD].record.Depth > Depth? this.displayNode(this.Map, this.Map[iD]): this.hideNode(this.Map, this.Map[iD]);

    }
  }
  protected displayNode(map: NodeMap, node: Node) {
    if (node.parentExistsOn(map)) {
      map[node.record.Parent].ui.show = true;
      map[node.record.Parent].ui.forceShow = true;
      this.displayNode(map, map[node.record.Parent]);
    }
  }
  protected hideNode(map: NodeMap, node: Node) {
    if (node.parentExistsOn(map) && !map[node.record.Parent].ui.forceShow) {
      map[node.record.Parent].ui.show = false;
      this.hideNode(map, map[node.record.Parent]);
    }
  }

}
export interface NodeMap {
  [property: string]: Node
}


export interface fetchedTree {
  Nodes: Array<INodeRecord>;
}

export class NodeRecord implements INodeRecord {
  Id: string;
  Name: string;
  Description?: string;
  Tooltip?: string;
  Depth: number;
  Parent?: number;
  Nodes: string[] = [];
  constructor() {

  }

}
export class NodeUI implements INodeUI {
  public delete: boolean = false;
  public index: number;
  public show: boolean;
  public errors: ErrorNode;
  public edit: boolean;
  public forceShow: boolean;
  public get hasError(): boolean {
    
    for (let att in this.errors) {
      if (this.error(att)) {
        console.log("error:", att);
        return true;
      }
    }

    return false;
  }
  constructor(_index: number) {
    this.index = _index;
    this.show = false;
    this.errors = {};
  }
  public error(att: string) {
    return this.errors[att];
  }
  public setError(att: string, set: boolean = false): boolean {
    console.log("setting error", att)
    this.errors[att] = set || !(this.errors[att]);
    return this.errors[att];
  }
}
export class Node implements INode {
  public record: NodeRecord;
  public ui: NodeUI;
  //public maxDepth: number;
  constructor(record: INodeRecord, index: number) {
    this.record = Object.assign(new NodeRecord(), record || {});
    this.ui = new NodeUI(index);
  }
  public get hasError(): boolean {
    
    return this.ui.hasError;
  }
  public get hasChildren(): boolean {
    return (this.record.Nodes.length > 0);
  }

  public setError(att: string, set: boolean = false) {
    this.ui.setError(att, set);
    
  }
  public parentExistsOn(map: NodeMap): boolean {
    return this.record.Parent && !(!map[this.record.Parent]);
  }
  public hasChild(id: string): boolean {
    
    for (let i = 0; i < this.record.Nodes.length; i++) {
      if (id === this.record.Nodes[i]) return true;
    }
    return false;
  }
  public deleteChild(id: string) {
    for (let i = this.record.Nodes.length - 1; i >= 0; i--) {
      if (id === this.record.Nodes[i]) this.record.Nodes.splice(i, 1);
    }
  }
}


export interface INode {
  record: INodeRecord,
  ui: INodeUI
}

export interface INodeRecord {
  Id: string;
  Name: string;
  Description?: string;
  Tooltip?: string;
  Depth: number;
  Parent?: number;
  Nodes: Array<string>;
}
export interface INodeUI {
  delete: boolean;
  show?: boolean;
  errors?: ErrorNode;
  edit?: boolean;
  index: number;
  forceShow?: boolean;

}
export interface ErrorNode {
  Name?: boolean;
  Description?: boolean;
  Depth?: boolean;

}
