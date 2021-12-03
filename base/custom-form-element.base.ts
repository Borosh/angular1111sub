import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  Input,
  Optional,
  Output,
  Self,
} from "@angular/core";
import { ControlValueAccessor, NgControl, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

@Directive()
export class CustomFormElementBase<T> implements ControlValueAccessor {
  @Input()
  value: T;
  @Input()
  errorMessage: string;
  @Input()
  disabled: boolean;
  @Input()
  required: boolean;
  @Output()
  change = new EventEmitter<T>();

  matcher: ErrorStateMatcher;

  constructor(
    @Self() @Optional() protected ngControl: NgControl,
    private cdr: ChangeDetectorRef
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
      setTimeout(() => {
        ngControl.statusChanges.subscribe((status) => {
          console.log({ status, error: ngControl.errors });

          this.errorMessage = ngControl.errors
            ? Object.values(ngControl.errors)[0]
            : "";
          this.disabled = ngControl.disabled;
          this.required = ngControl.control.hasValidator(Validators.required);
          console.log({ required: this.required });
          this.cdr.detectChanges();
        });
        this.matcher = {
          isErrorState: (): boolean => {
            console.log("isErrorState");
            console.log(this.ngControl.touched, this.ngControl.invalid);
            return this.ngControl.touched && this.ngControl.invalid;
          },
        };
      }, 0);
    }
  }

  onChanged: (...args: any[]) => void;
  onTouched: (...args: any[]) => void;

  writeValue(value: T) {
    if (this.onChanged) {
      this.onChanged(value);
    }
    this.value = value;
  }

  onValueChanges(value: T) {
    this.change.emit(value);
    if (this.ngControl && this.onTouched) {
      this.onTouched();
    }
    this.writeValue(value);
  }

  registerOnChange(fn: any) {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
