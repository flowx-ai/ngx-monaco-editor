import { Injectable } from "@angular/core";
import { environment } from "src/demo/environments/environment";

@Injectable({
  providedIn: "root",
})
export class FlowXAPI {
  private _token: string | undefined;
  private FLOWX_API = environment.baseUrl;
  constructor() {}

  public async getFavoriteProcesses(): Promise<any> {
    this._token = await this.getToken();
    let processes = undefined;
    try {
      const response = await fetch(
        `${this.FLOWX_API}/api/process-versions?page=0&size=20&sort=modifiedDate,desc&tab=FAVORITES`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      processes = (await response.json()) as any;
    } catch (ex: any) {
      console.log(
        "getFavoriteProcesses: Error fetching favorite processes",
        ex
      );
    }
    if ((processes && processes.error) || !processes) {
      console.log("getFavoriteProcesses", "Error API try to resignIn");
      this._token = await this.getToken();
      const response = await fetch(
        `${this.FLOWX_API}/api/process-versions?page=0&size=20&sort=modifiedDate,desc&tab=FAVORITES`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      processes = (await response.json()) as any;
      if (processes && processes.error) {
        console.log("getFavoriteProcesses", "Still error :(");
        return Promise.resolve([]);
      }
      return Promise.resolve(processes);
    } else if (processes) {
      return Promise.resolve(processes);
    } else {
      return Promise.resolve([]);
    }
  }

  public async getProcessVersionDetails(versionId: string): Promise<any> {
    this._token = await this.getToken();
    let process = undefined;
    try {
      const response = await fetch(
        `${this.FLOWX_API}/api/process-versions/${versionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      process = (await response.json()) as any;
    } catch (ex: any) {
      console.log(
        "getProcessVersionDetails: Error fetching detailed process",
        ex
      );
    }
    if ((process && process.error) || !process) {
      console.log("getProcessVersionDetails", "Error API try to resignIn");
      this._token = await this.getToken();
      const response = await fetch(
        `${this.FLOWX_API}/api/process-versions/${versionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this._token}`,
          },
        }
      );

      process = (await response.json()) as any;
      if (process && process.error) {
        console.log("getProcessVersionDetails", "Still error :(");
        return Promise.resolve(undefined);
      }
      return Promise.resolve(process);
    } else if (process) {
      return Promise.resolve(process);
    } else {
      return Promise.resolve(undefined);
    }
  }

  public async getProcessDataModelVersionDetails(
    versionId: string
  ): Promise<any> {
    this._token = await this.getToken();
    let processDataModel = undefined;
    try {
      const response = await fetch(
        `${this.FLOWX_API}/api/data-model/process-versions/${versionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      processDataModel = (await response.json()) as any;
    } catch (ex: any) {
      console.log(
        "getProcessDataModelVersionDetails: Error fetching detailed process",
        ex
      );
    }
    if ((processDataModel && processDataModel.error) || !processDataModel) {
      console.log("getProcessVersionDetails", "Error API try to resignIn");
      this._token = await this.getToken();
      const response = await fetch(
        `${this.FLOWX_API}/api/data-model/process-versions/${versionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this._token}`,
          },
        }
      );

      processDataModel = (await response.json()) as any;
      if (processDataModel && processDataModel.error) {
        console.log("getProcessDataModelVersionDetails", "Still error :(");
        return Promise.resolve(undefined);
      }
      return Promise.resolve(processDataModel);
    } else if (processDataModel) {
      return Promise.resolve(processDataModel);
    } else {
      return Promise.resolve(undefined);
    }
  }

  public async updateAction(action: any): Promise<any> {
    this._token = await this.getToken();
    let savedAction = undefined;
    try {
      const response = await fetch(`${this.FLOWX_API}/api/actions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this._token}`,
        },
        method: "PUT",
        body: JSON.stringify(action),
      });
      savedAction = (await response.json()) as any;
    } catch (ex: any) {
      console.log("updateAction: Error updating action", ex);
    }
    if (savedAction && savedAction.error) {
      console.log("updateAction", "Invalid token try to resignIn");
      return Promise.resolve([]);
    } else if (savedAction) {
      return Promise.resolve(savedAction);
    } else {
      return Promise.resolve([]);
    }
  }

  public async submitChanges(processId: string, message: string): Promise<any> {
    this._token = await this.getToken();
    let changesSubmited = undefined;
    try {
      const response = await fetch(
        `${this.FLOWX_API}/api/process-versions/${processId}/commit`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this._token}`,
          },
          method: "POST",
          body: JSON.stringify({ submitMessage: message }),
        }
      );
      changesSubmited = (await response.json()) as any;
    } catch (ex: any) {
      console.log("changesSubmited: Error updating action", ex);
    }
    if (changesSubmited && changesSubmited.error) {
      console.log("changesSubmited", "Invalid token try to resignIn");
      return Promise.resolve([]);
    } else if (changesSubmited) {
      return Promise.resolve(changesSubmited);
    } else {
      return Promise.resolve([]);
    }
  }

  public async startNewVersion(
    previousProjectId: string,
    branchName: string
  ): Promise<any> {
    this._token = await this.getToken();
    let changesSubmited = undefined;
    try {
      const response = await fetch(`${this.FLOWX_API}/api/process-versions/wip`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this._token}`,
        },
        method: "POST",
        body: JSON.stringify({
          previousVersionId: previousProjectId,
          branchName: branchName,
        }),
      });
      changesSubmited = (await response.json()) as any;
    } catch (ex: any) {
      console.log("changesSubmited: Error updating action", ex);
    }
    if (changesSubmited && changesSubmited.error) {
      console.log("changesSubmited", "Invalid token try to resignIn");
      return Promise.resolve([]);
    } else if (changesSubmited) {
      return Promise.resolve(changesSubmited);
    } else {
      return Promise.resolve([]);
    }
  }

  public async getAllVersions(processId: string): Promise<any> {
    this._token = await this.getToken();
    let processVersions = undefined;
    try {
      const response = await fetch(
        `${this.FLOWX_API}/api/processes/${processId}/history`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this._token}`,
          },
        }
      );
      processVersions = (await response.json()) as any;
    } catch (ex: any) {
      console.log("getAllVersions: Error fetching favorite processes", ex);
    }
    if (processVersions && processVersions.error) {
      console.log("getAllVersions", "Invalid token try to resignIn");
      return Promise.resolve([]);
    } else if (processVersions) {
      return Promise.resolve(processVersions);
    } else {
      return Promise.resolve([]);
    }
  }

  private async getToken(): Promise<string | undefined> {
    return localStorage.getItem("access_token");
  }
}
