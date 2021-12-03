import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { MatSelect, MatSelectChange } from "@angular/material/select";
import { CustomFormElementBase } from "@shared/base/custom-form-element.base";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export interface SelectOption {
  value: string;
  viewValue: string;
}
@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent
  extends CustomFormElementBase<string>
  implements OnDestroy
{
  @ViewChild("select")
  select: MatSelect;
  @Input()
  label: string;
  @Input()
  options: SelectOption[];

  private subject = new Subject<void>();

  ngOnInit(): void {
    this.ngControl?.statusChanges
      .pipe(takeUntil(this.subject))
      .subscribe((_) => {
        console.log("updateErrorState");
        this.select.updateErrorState();
      });
  }

  selectionChanged(selectionChange: MatSelectChange) {
    this.onValueChanges(selectionChange.value);
  }

  ngOnDestroy() {
    this.subject.next();
  }
}
