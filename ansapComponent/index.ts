import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class ansapComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private _this = this;
  private _value:string;
  private _context: ComponentFramework.Context<IInputs>;
  private _container: HTMLDivElement;
  private _googleApiKey: string | null;
  private _notifyOutputChanged: () => void;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
    this._googleApiKey = context.parameters.GoogleAPIKey.raw;
    this._context = context;
    this._notifyOutputChanged = notifyOutputChanged;
    
    this.addScriptToForm();

    let divElemet = this.createDivElement();
    container.appendChild(divElemet)


  }
  
  private createDivElement(): any {
    let divElement = document.createElement('div');
    let parentThis = this;

    let inputElement = document.createElement('input');
    inputElement.id = 'sb_googleAutocomplete';

    inputElement.addEventListener('keyup', function(e) {
      let elem = <HTMLInputElement>e.target;
      let inputValue = elem.value;

      parentThis._context.parameters.Address.raw = inputValue;
      parentThis._notifyOutputChanged();
    });

    divElement.appendChild(inputElement);
    return divElement;
  }

  private addScriptToForm() {
    let scriptElement = document.createElement("script");
    scriptElement.src = "https://maps.googleapis.com/maps/api/js?key=" + this._googleApiKey + "&libraries=places&language=uk";
    scriptElement.type = "text/javascript";

    let head = <HTMLHeadElement>document.getElementsByTagName("head")[0];
    head.appendChild(scriptElement);
  }

  private initAutoComplete() {
    let parentThis = this;
    let count = 0;
    let timer = setInterval(function() {
      if (count <= 10) {
        if (typeof google != "undefined") {
          clearInterval(timer)

          const autocomplete = new google.maps.places.Autocomplete(<HTMLInputElement>document.getElementById('sb_googleAutocomplete'));
          autocomplete.addListener('place_changed', function() {

          })
        } else {
          count++
        }
      } else {
        clearInterval(timer)
      }
    }, 1000)
  }

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}