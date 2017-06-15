import { TestBed, async, inject, ComponentFixture } from "@angular/core/testing";
import { Type, DebugElement } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { UploadModule } from "@progress/kendo-angular-upload";
import {
    DynamicFormsCoreModule,
    DynamicFormService,
    DynamicCheckboxModel,
    DynamicCheckboxGroupModel,
    DynamicDatePickerModel,
    DynamicEditorModel,
    DynamicFileUploadModel,
    DynamicFormArrayModel,
    DynamicFormControlModel,
    DynamicFormGroupModel,
    DynamicInputModel,
    DynamicRadioGroupModel,
    DynamicSelectModel,
    DynamicSliderModel,
    DynamicSwitchModel,
    DynamicTextAreaModel,
    DynamicTimePickerModel
} from "@ng2-dynamic-forms/core";
import { DynamicFormKendoComponent } from "./dynamic-form-kendo.component";
import { KendoFormControlType } from "./dynamic-form-kendo.const";

describe("DynamicFormKendoComponent test suite", () => {

    let formModel = [
            new DynamicCheckboxModel({id: "checkbox"}),
            new DynamicCheckboxGroupModel({id: "checkboxGroup", group: []}),
            new DynamicDatePickerModel({id: "datepicker"}),
            new DynamicEditorModel({id: "editor"}),
            new DynamicFileUploadModel({id: "upload", url: ""}),
            new DynamicFormArrayModel({id: "formArray", createGroup: () => []}),
            new DynamicFormGroupModel({id: "formGroup", group: []}),
            new DynamicInputModel({id: "input", maxLength: 51}),
            new DynamicRadioGroupModel({id: "radioGroup"}),
            new DynamicSelectModel({id: "select", options: [{value: "One"}, {value: "Two"}], value: "One"}),
            new DynamicSliderModel({id: "slider"}),
            new DynamicSwitchModel({id: "switch"}),
            new DynamicTextAreaModel({id: "textarea"}),
            new DynamicTimePickerModel({id: "timepicker"})
        ],
        testModel = formModel[9] as DynamicSelectModel<string>,
        formGroup: FormGroup,
        fixture: ComponentFixture<DynamicFormKendoComponent>,
        component: DynamicFormKendoComponent,
        debugElement: DebugElement,
        testElement: DebugElement;

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            imports: [
                ReactiveFormsModule,
                DateInputsModule,
                DropDownsModule,
                InputsModule,
                UploadModule,
                DynamicFormsCoreModule.forRoot()
            ],
            declarations: [DynamicFormKendoComponent]

        }).compileComponents().then(() => {

            fixture = TestBed.createComponent(DynamicFormKendoComponent as Type<DynamicFormKendoComponent>);

            component = fixture.componentInstance;
            debugElement = fixture.debugElement;
        });
    }));

    beforeEach(inject([DynamicFormService], (service: DynamicFormService) => {

        formGroup = service.createFormGroup(formModel);

        component.group = formGroup;
        component.model = testModel;

        fixture.detectChanges();

        testElement = debugElement.query(By.css(`kendo-dropdownlist`));
    }));

    it("should initialize correctly", () => {

        expect(component.context).toBeNull();
        expect(component.control instanceof FormControl).toBe(true);
        expect(component.group instanceof FormGroup).toBe(true);
        expect(component.model instanceof DynamicFormControlModel).toBe(true);
        expect(component.hasErrorMessaging).toBe(false);

        expect(component.onControlValueChanges).toBeDefined();
        expect(component.onModelDisabledUpdates).toBeDefined();
        expect(component.onModelValueUpdates).toBeDefined();

        expect(component.blur).toBeDefined();
        expect(component.change).toBeDefined();
        expect(component.focus).toBeDefined();

        expect(component.onValueChange).toBeDefined();
        expect(component.onFocusChange).toBeDefined();

        expect(component.isValid).toBe(true);
        expect(component.isInvalid).toBe(false);

        expect(component.type).toEqual(KendoFormControlType.DropDownList);
    });

    it("should have correct view child", () => {

        expect(component.kendoDropDownList).toBeDefined();
    });

    it("should listen to focus events", () => {

        spyOn(component, "onFocus").and.callThrough();

        testElement.triggerEventHandler("focus", null);

        expect(component.onFocus).toHaveBeenCalled();
    });

    it("should listen to blur events", () => {

        spyOn(component, "onBlur").and.callThrough();

        testElement.triggerEventHandler("blur", null);

        expect(component.onBlur).toHaveBeenCalled();
    });

    it("should listen to native change event", () => {

        spyOn(component, "onValueChange");

        testElement.triggerEventHandler("valueChange", null);

        expect(component.onValueChange).toHaveBeenCalled();
    });

    it("should update model value when control value changes", () => {

        spyOn(component, "onControlValueChanges");

        component.ngOnInit();

        component.control.setValue("test");

        expect(component.onControlValueChanges).toHaveBeenCalled();
    });

    it("should update control value when model value changes", () => {

        spyOn(component, "onModelValueUpdates");

        component.ngOnInit();

        testModel.valueUpdates.next("Two");

        expect(component.onModelValueUpdates).toHaveBeenCalled();
    });

    it("should update control activation when model disabled property changes", () => {

        spyOn(component, "onModelDisabledUpdates");

        component.ngOnInit();

        testModel.disabledUpdates.next(true);

        expect(component.onModelDisabledUpdates).toHaveBeenCalled();
    });

    it("should set correct form control type", () => {

        let testFn = component["getFormControlType"].bind(component);

        component.model = formModel[0];
        expect(testFn()).toEqual(KendoFormControlType.Checkbox);

        component.model = formModel[1];
        expect(testFn()).toEqual(KendoFormControlType.CheckboxGroup);

        component.model = formModel[2];
        expect(testFn()).toEqual(KendoFormControlType.DatePicker);

        (formModel[2] as DynamicDatePickerModel).inline = true;
        expect(testFn()).toEqual(KendoFormControlType.Calendar);

        component.model = formModel[3];
        expect(testFn()).toBeNull();

        component.model = formModel[4];
        expect(testFn()).toEqual(KendoFormControlType.Upload);

        component.model = formModel[5];
        expect(testFn()).toEqual(KendoFormControlType.Array);

        component.model = formModel[6];
        expect(testFn()).toEqual(KendoFormControlType.Group);

        component.model = formModel[7];
        expect(testFn()).toEqual(KendoFormControlType.Input);

        (formModel[7] as DynamicInputModel).list = ["test1", "test2", "test3"];
        expect(testFn()).toEqual(KendoFormControlType.AutoComplete);

        (formModel[7] as DynamicInputModel).mask = "0000-0000-0000-0000";
        expect(testFn()).toEqual(KendoFormControlType.MaskedTextBox);

        (formModel[7] as DynamicInputModel).inputType = "date";
        expect(testFn()).toEqual(KendoFormControlType.DateInput);

        (formModel[7] as DynamicInputModel).inputType = "number";
        (formModel[7] as DynamicInputModel).mask = null;
        expect(testFn()).toEqual(KendoFormControlType.NumericTextBox);

        component.model = formModel[8];
        expect(testFn()).toEqual(KendoFormControlType.RadioGroup);

        component.model = formModel[9];
        expect(testFn()).toEqual(KendoFormControlType.DropDownList);

        (formModel[9] as DynamicSelectModel<string>).multiple = true;
        expect(testFn()).toEqual(KendoFormControlType.MultiSelect);

        component.model = formModel[10];
        expect(testFn()).toEqual(KendoFormControlType.Slider);

        component.model = formModel[11];
        expect(testFn()).toEqual(KendoFormControlType.Switch);

        component.model = formModel[12];
        expect(testFn()).toEqual(KendoFormControlType.TextArea);

        component.model = formModel[13];
        expect(testFn()).toEqual(KendoFormControlType.TimePicker);
    });
});