import { FormProvider, useForm } from "react-hook-form";
import FontSection from "./FontSection";
import ThemeSection from "./ThemeSection";
import TimeSection from "./TimeSection";
import settingsIcon from "../../assets/icon-settings.svg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/Dialog";
import { useEffect, useState } from "react";
//import { useSettingsContext } from "../../contexts/SettingsContext";
import Button from "../../components/Button";

function SettingsDialog() {
  const [open, setOpen] = useState(false);

  //const settings = useSettingsContext();

  const form = useForm({
    defaultValues: {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      font: "kumbh",
      theme: "default",
    },
  });

  const { handleSubmit, reset } = form;

  const submitSettings = (data) => {
    /*settings?.saveFont(data.font);
    settings?.saveTheme(data.theme);
    settings?.savePomodoro(data.pomodoro);
    settings?.saveShortBreak(data.shortBreak);
    settings?.saveLongBreak(data.longBreak);*/

    setOpen(false);
  };

  useEffect(() => {
    /*const font = settings?.font;
    const theme = settings?.theme;
    const pomodoro = settings?.pomodoro;
    const shortBreak = settings?.shortBreak;
    const longBreak = settings?.longBreak;*/

    /*if (font || theme || pomodoro || shortBreak || longBreak) {
      reset({
        font: font ?? "kumbh",
        theme: theme ?? "default",
        pomodoro: pomodoro ?? 25,
        shortBreak: shortBreak ?? 5,
        longBreak: longBreak ?? 15,
      });
    }*/
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <img src={settingsIcon} alt="" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="px-8 pb-12 pt-6"
            onSubmit={handleSubmit(submitSettings)}
          >
            <TimeSection />
            <hr className="my-6 border-darkBlue/10" />
            <FontSection />
            <hr className="my-6 border-darkBlue/10" />
            <ThemeSection />
            <div className="absolute -bottom-6 left-1/2 h-14 w-32 -translate-x-1/2 rounded-full bg-white ">
              <Button
                className="h-14 w-32 rounded-full bg-accent1 font-bold text-white ring-1 ring-accent1 hover:bg-accent1/80 focus-visible:outline-accent1"
                type="submit"
              >
                Apply
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
